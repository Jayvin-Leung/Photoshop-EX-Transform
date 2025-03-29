function convert(layerIds) {
  var layers = [];
  for (var i = 0; i < layerIds.length; i++) {
    var layerId = layerIds[i];
    var lock = Layer.getLock(layerId);
    var kind = Layer.getKind(layerId);
    var linkedLayerIds = Layer.getLinkedLayerIds(layerId);
    var isLinked = linkedLayerIds.length > 0;
    layers.push({
      id: layerId,
      isVisible: Layer.isVisible(layerId),
      isGroup: Layer.isGroup(layerId),
      isLocked: lock.protectAll || lock.protectComposite,
      isTextLayer: kind === 3,
      isShapeLayer: kind === 4,
      isSmartLayer: kind === 5,
      isLinked: isLinked,
      linkedLayerIds: isLinked ? linkedLayerIds.concat([layerId]) : [],
      hasMask: Layer.hasMask(layerId),
    });
  }
  return layers;
}

function filter(layers) {
  var target = { layerIds: [], layers: [] };
  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    if (layer.isLocked || layer.isTextLayer || layer.isShapeLayer || layer.isSmartLayer) {
      continue;
    }
    target.layerIds.push(layer.id);
    target.layers.push(layer);
  }
  return target;
}

function freeTransform(commit, cancel) {
  try {
    app.runMenuItem(charIDToTypeID('FrTr'));
    commit && commit();
  } catch (error) {
    cancel && cancel();
  }
}

function transformAgain(commit, cancel) {
  try {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(
      charIDToTypeID('Lyr '),
      charIDToTypeID('Ordn'),
      charIDToTypeID('Trgt')
    );
    desc.putReference(charIDToTypeID('null'), ref);
    desc.putBoolean(charIDToTypeID('LstT'), true);
    executeAction(charIDToTypeID('Trnf'), desc, DialogModes.NO);
    commit && commit();
  } catch (error) {
    cancel && cancel();
  }
}

function dispatchEvent(type, data) {
  new ExternalObject('lib:PlugPlugExternalObject');
  var event = new CSXSEvent();
  event.type = type;
  if (data) event.data = data;
  event.dispatch();
}

function retainHistory(layerIds) {
  Layer.active(layerIds);
  History.previous();
  History.last();
  Layer.active(layerIds);
}

function afterCommit(ids) {
  try {
    retainHistory(ids.split(','));
    return true;
  } catch (error) {
    return false;
  }
}

function afterCancel(ids) {
  try {
    History.delete();
    retainHistory(ids.split(','));
    return true;
  } catch (error) {
    return false;
  }
}

function transform() {
  function _(target, origin) {
    var selection = new Selection('ex-transform');
    selection.save();

    Layer.duplicate(target.layerIds);
    Layer.merge(Layer.getSelectedLayerIds());
    Layer.hide(target.layerIds);

    var tempLayerId = app.activeDocument.activeLayer.id;
    Layer.red([tempLayerId]);
    freeTransform(
      function () {
        var len = target.layerIds.length;
        function _() {
          for (var i = 0; i < len; i++) {
            app.changeProgressText('EX-自由变换（' + (i + 1) + '/' + len + '）');
            app.updateProgress(i + 1, len);
            var layer = target.layers[i];

            if (layer.isGroup) {
              layer.isVisible ? Layer.show([layer.id]) : Layer.hide([layer.id]);
              continue;
            }

            if (layer.isLinked) Layer.unlink(layer.linkedLayerIds);

            Layer.active([layer.id]);
            Layer.show([layer.id]);
            selection.load();
            transformAgain(null, null);

            if (layer.hasMask) {
              Layer.activeMask([layer.id]);
              selection.load();
              transformAgain(null, null);
            }

            if (layer.isLinked) Layer.link(layer.linkedLayerIds);
            if (!layer.isVisible) Layer.hide([layer.id]);
          }
        }
        app.doForcedProgress('EX-自由变换（0/' + len + '）', '_();');

        Layer.delete([tempLayerId]);
        selection.remove();
        Selection.cancel();

        dispatchEvent('commit', target.layerIds);
      },
      function () {
        for (var i = 0; i < origin.layers.length; i++) {
          var layer = origin.layers[i];
          layer.isVisible ? Layer.show([layer.id]) : Layer.hide([layer.id]);
        }
        dispatchEvent('cancel', origin.layerIds);
      }
    );
  }

  try {
    if (!Selection.exist()) {
      alert('未找到有效选区');
      return true;
    }

    var layerIds = Layer.getSelectedLayerIds();
    if (layerIds.length === 0) {
      alert('未选中任何图层');
      return true;
    }

    var layers = convert(layerIds);
    var target = filter(layers);
    if (target.layerIds.length === 0) {
      alert('缺少可操作图层');
      return true;
    }

    if (target.layerIds.length === 1) {
      freeTransform(null, null);
      return true;
    }

    app.activeDocument.suspendHistory(
      'ex-transform',
      '_(target, { layerIds: layerIds, layers: layers });'
    );
    return true;
  } catch (error) {
    return false;
  }
}
