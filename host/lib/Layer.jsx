function Layer(id) {
  this.id = id;
}

Layer.getSelectedLayerIds = function () {
  var targetLayersTypeId = app.stringIDToTypeID('targetLayersIDs');
  var selectedLayersReference = new ActionReference();
  selectedLayersReference.putProperty(app.charIDToTypeID('Prpr'), targetLayersTypeId);
  selectedLayersReference.putEnumerated(
    app.charIDToTypeID('Dcmn'),
    app.charIDToTypeID('Ordn'),
    app.charIDToTypeID('Trgt')
  );
  var desc = app.executeActionGet(selectedLayersReference);
  var layers = [];
  if (desc.hasKey(targetLayersTypeId)) {
    var list = desc.getList(targetLayersTypeId);
    for (var i = 0; i < list.count; i++) {
      var ar = list.getReference(i);
      var layerId = ar.getIdentifier();
      layers.push(layerId);
    }
  }
  return layers;
};

Layer.isVisible = function (id) {
  if (!id) throw new Error('id is null');

  var layerReference = new ActionReference();
  layerReference.putProperty(charIDToTypeID('Prpr'), charIDToTypeID('Vsbl'));
  layerReference.putIdentifier(charIDToTypeID('Lyr '), id);
  var descriptor = executeActionGet(layerReference);
  if (descriptor.hasKey(charIDToTypeID('Vsbl')) == false) return false;
  return descriptor.getBoolean(charIDToTypeID('Vsbl'));
};

Layer.isGroup = function (id) {
  if (!id) throw new Error('id is null');

  try {
    var layerReference = new ActionReference();
    layerReference.putIdentifier(charIDToTypeID('Lyr '), id);
    var descriptor = executeActionGet(layerReference);
    if (descriptor.hasKey(stringIDToTypeID('layerSection'))) {
      var flag = stringIDToTypeID('layerSectionStart');
      if (descriptor.getEnumerationValue(stringIDToTypeID('layerSection')) === flag) {
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
};

Layer.getKind = function (id) {
  if (!id) throw new Error('id is null');

  try {
    var typeID = stringIDToTypeID('layerKind');
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID('Prpr'), typeID);
    ref.putIdentifier(charIDToTypeID('Lyr '), id);
    var desc = executeActionGet(ref);
    if (!desc.hasKey(typeID)) return -1;

    return desc.getInteger(typeID);
  } catch (error) {
    return -1;
  }
};

Layer.isTextKind = function (id) {
  return Layer.getKind(id) === 3;
};

Layer.isShapeKind = function (id) {
  return Layer.getKind(id) === 4;
};

Layer.isSmartObjectKind = function (id) {
  return Layer.getKind(id) === 5;
};

Layer.getLock = function (id) {
  if (!id) throw new Error('id is null');

  try {
    var typeID = stringIDToTypeID('layerLocking');
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID('Prpr'), typeID);
    ref.putIdentifier(charIDToTypeID('Lyr '), id);
    var desc = executeActionGet(ref);
    if (!desc.hasKey(typeID)) return {};

    var lock = {};
    var obj = desc.getObjectValue(typeID);
    for (var i = 0; i < obj.count; i++) {
      var typeID = obj.getKey(i);
      lock[typeIDToStringID(typeID)] = obj.getBoolean(typeID);
    }
    return lock;
  } catch (error) {
    return {};
  }
};

Layer.isLockTransparent = function (id) {
  return Layer.getLock(id).protectTransparency;
};

Layer.isLockImage = function (id) {
  return Layer.getLock(id).protectComposite;
};

Layer.isLockPosition = function (id) {
  return Layer.getLock(id).protectPosition;
};

Layer.isLockArtboard = function (id) {
  return Layer.getLock(id).protectArtboardAutonest;
};

Layer.isLockAll = function (id) {
  return Layer.getLock(id).protectAll;
};

Layer.hasMask = function (id) {
  if (!id) throw new Error('id is null');

  try {
    var typeID = stringIDToTypeID('hasUserMask');
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID('Prpr'), typeID);
    ref.putIdentifier(charIDToTypeID('Lyr '), id);
    var desc = executeActionGet(ref);
    if (!desc.hasKey(typeID)) return false;

    return desc.getBoolean(typeID);
  } catch (error) {
    return false;
  }
};

Layer.getLinkedLayerIds = function (id) {
  if (!id) throw new Error('id is null');

  try {
    var typeID = charIDToTypeID('LnkL');
    var ref = new ActionReference();
    ref.putProperty(charIDToTypeID('Prpr'), typeID);
    ref.putIdentifier(charIDToTypeID('Lyr '), id);
    var desc = executeActionGet(ref);
    if (!desc.hasKey(typeID)) return [];

    var layerIds = [];
    var list = desc.getList(typeID);
    for (var i = 0; i < list.count; i++) {
      layerIds.push(list.getInteger(i));
    }
    return layerIds;
  } catch (error) {
    return [];
  }
};

Layer.isLinked = function (id) {
  return Layer.getLinkedLayerIds(id).length > 0;
};

Layer.active = function (ids) {
  if (!ids || !ids.length || ids.length <= 0) return;

  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  for (var i = 0; i < ids.length; i++) {
    ref.putIdentifier(charIDToTypeID('Lyr '), ids[i]);
  }
  desc.putReference(charIDToTypeID('null'), ref);
  desc.putBoolean(charIDToTypeID('MkVs'), false);
  executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
};

Layer.activeMask = function (ids) {
  if (!ids || !ids.length || ids.length <= 0) return;

  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(
    charIDToTypeID('Chnl'),
    charIDToTypeID('Chnl'),
    charIDToTypeID('Msk ')
  );
  for (var i = 0; i < ids.length; i++) {
    ref.putIdentifier(charIDToTypeID('Lyr '), ids[i]);
  }
  desc.putReference(charIDToTypeID('null'), ref);
  desc.putBoolean(charIDToTypeID('MkVs'), false);
  executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
};

Layer.hide = function (ids) {
  if (!ids || !ids.length || ids.length <= 0) return;

  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  for (var i = 0; i < ids.length; i++) {
    ref.putIdentifier(charIDToTypeID('Lyr '), ids[i]);
  }
  var list = new ActionList();
  list.putReference(ref);
  desc.putList(charIDToTypeID('null'), list);
  executeAction(charIDToTypeID('Hd  '), desc, DialogModes.NO);
};

Layer.show = function (ids) {
  if (!ids || !ids.length || ids.length <= 0) return;

  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  for (var i = 0; i < ids.length; i++) {
    ref.putIdentifier(charIDToTypeID('Lyr '), ids[i]);
  }
  var list = new ActionList();
  list.putReference(ref);
  desc.putList(charIDToTypeID('null'), list);
  executeAction(charIDToTypeID('Shw '), desc, DialogModes.NO);
};

Layer.red = function (ids) {
  if (!ids || !ids.length || ids.length <= 0) return;

  Layer.active(ids);

  var desc1 = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(
    charIDToTypeID('Lyr '),
    charIDToTypeID('Ordn'),
    charIDToTypeID('Trgt')
  );
  desc1.putReference(charIDToTypeID('null'), ref);
  var desc2 = new ActionDescriptor();
  desc2.putEnumerated(
    charIDToTypeID('Clr '),
    charIDToTypeID('Clr '),
    charIDToTypeID('Rd  ')
  );
  desc1.putObject(charIDToTypeID('T   '), charIDToTypeID('Lyr '), desc2);
  executeAction(charIDToTypeID('setd'), desc1, DialogModes.NO);
};

Layer.duplicate = function (ids) {
  if (!ids || !ids.length || ids.length <= 0) return;

  Layer.active(ids);

  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(
    charIDToTypeID('Lyr '),
    charIDToTypeID('Ordn'),
    charIDToTypeID('Trgt')
  );
  desc.putReference(charIDToTypeID('null'), ref);
  desc.putInteger(charIDToTypeID('Vrsn'), 5);
  var list = new ActionList();
  for (var i = 0; i < ids.length; i++) {
    list.putInteger(ids[i]);
  }
  desc.putList(charIDToTypeID('Idnt'), list);
  executeAction(charIDToTypeID('Dplc'), desc, DialogModes.NO);
};

Layer.merge = function (ids) {
  if (!ids || !ids.length || ids.length <= 0) return;

  Layer.active(ids);

  executeAction(charIDToTypeID('Mrg2'), new ActionDescriptor(), DialogModes.NO);
};

Layer.link = function (ids) {
  if (!ids || !ids.length || ids.length <= 0) return;

  Layer.active(ids);

  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(
    charIDToTypeID('Lyr '),
    charIDToTypeID('Ordn'),
    charIDToTypeID('Trgt')
  );
  desc.putReference(charIDToTypeID('null'), ref);
  executeAction(stringIDToTypeID('linkSelectedLayers'), desc, DialogModes.NO);
};

Layer.unlink = function (ids) {
  Layer.link(ids);
};

Layer.delete = function (ids) {
  if (!ids || !ids.length || ids.length <= 0) return;

  Layer.active(ids);

  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(
    charIDToTypeID('Lyr '),
    charIDToTypeID('Ordn'),
    charIDToTypeID('Trgt')
  );
  desc.putReference(charIDToTypeID('null'), ref);
  var list = new ActionList();
  for (var i = 0; i < ids.length; i++) {
    list.putInteger(ids[i]);
  }
  desc.putList(charIDToTypeID('LyrI'), list);
  executeAction(charIDToTypeID('Dlt '), desc, DialogModes.NO);
};

Layer.prototype.isVisible = function () {
  return Layer.isVisible(this.id);
};

Layer.prototype.isGroup = function () {
  return Layer.isGroup(this.id);
};

Layer.prototype.getKind = function () {
  return Layer.getKind(this.id);
};

Layer.prototype.isTextKind = function () {
  return Layer.isTextKind(this.id);
};

Layer.prototype.isShapeKind = function () {
  return Layer.isTextKind(this.id);
};

Layer.prototype.isSmartObjectKind = function () {
  return Layer.isTextKind(this.id);
};

Layer.prototype.getLock = function () {
  return Layer.getLock(this.id);
};

Layer.prototype.isLockTransparent = function () {
  return Layer.isLockTransparent(this.id);
};

Layer.prototype.isLockImage = function () {
  return Layer.isLockImage(this.id);
};

Layer.prototype.isLockPosition = function () {
  return Layer.isLockPosition(this.id);
};

Layer.prototype.isLockArtboard = function () {
  return Layer.isLockArtboard(this.id);
};

Layer.prototype.isLockAll = function () {
  return Layer.isLockAll(this.id);
};

Layer.prototype.hasMask = function () {
  return Layer.hasMask(this.id);
};

Layer.prototype.getLinkedLayerIds = function () {
  return Layer.getLinkedLayerIds(this.id);
};

Layer.prototype.isLinked = function () {
  return Layer.isLinked(this.id);
};

Layer.prototype.active = function () {
  Layer.active([this.id]);
};

Layer.prototype.activeMask = function () {
  Layer.activeMask([this.id]);
};

Layer.prototype.hide = function () {
  Layer.hide([this.id]);
};

Layer.prototype.show = function () {
  Layer.show([this.id]);
};

Layer.prototype.red = function () {
  Layer.red([this.id]);
};

Layer.prototype.duplicate = function () {
  Layer.duplicate([this.id]);
};

Layer.prototype.merge = function () {
  Layer.merge([this.id]);
};

Layer.prototype.link = function () {
  Layer.link([this.id]);
};

Layer.prototype.unlink = function () {
  Layer.unlink([this.id]);
};

Layer.prototype.remove = function () {
  Layer.delete([this.id]);
};
