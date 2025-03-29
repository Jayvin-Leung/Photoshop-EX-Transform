function Selection(name) {
  this.name = name;
}

Selection.exist = function () {
  try {
    app.activeDocument.selection.bounds;
    return true;
  } catch (error) {
    return false;
  }
};

Selection.has = function (name) {
  try {
    // 只会获取相同名称中的第一个
    app.activeDocument.channels.getByName(name);
    return true;
  } catch (error) {
    return false;
  }
};

Selection.cancel = function () {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putProperty(charIDToTypeID('Chnl'), charIDToTypeID('fsel'));
  desc.putReference(charIDToTypeID('null'), ref);
  desc.putEnumerated(
    charIDToTypeID('T   '),
    charIDToTypeID('Ordn'),
    charIDToTypeID('None')
  );
  executeAction(charIDToTypeID('setd'), desc, DialogModes.NO);
};

Selection.prototype.save = function () {
  if (!Selection.exist()) return;
  if (Selection.has(this.name)) {
    this.replace();
    return;
  }

  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putProperty(charIDToTypeID('Chnl'), charIDToTypeID('fsel'));
  desc.putReference(charIDToTypeID('null'), ref);
  desc.putString(charIDToTypeID('Nm  '), this.name);
  executeAction(charIDToTypeID('Dplc'), desc, DialogModes.NO);
};

Selection.prototype.active = function () {
  if (!Selection.has(this.name)) return;

  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putName(charIDToTypeID('Chnl'), this.name);
  desc.putReference(charIDToTypeID('null'), ref);
  executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
};

Selection.prototype.load = function () {
  if (!Selection.has(this.name)) return;

  var desc = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putProperty(charIDToTypeID('Chnl'), charIDToTypeID('fsel'));
  desc.putReference(charIDToTypeID('null'), ref1);
  var ref2 = new ActionReference();
  ref2.putName(charIDToTypeID('Chnl'), this.name);
  desc.putReference(charIDToTypeID('T   '), ref2);
  executeAction(charIDToTypeID('setd'), desc, DialogModes.NO);
};

Selection.prototype.replace = function () {
  if (!Selection.exist()) return;
  if (!Selection.has(this.name)) {
    this.save();
  }

  var desc = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putName(charIDToTypeID('Chnl'), this.name);
  desc.putReference(charIDToTypeID('null'), ref1);
  var ref2 = new ActionReference();
  ref2.putProperty(charIDToTypeID('Chnl'), charIDToTypeID('fsel'));
  desc.putReference(charIDToTypeID('T   '), ref2);
  executeAction(charIDToTypeID('setd'), desc, DialogModes.NO);
};

Selection.prototype.remove = function () {
  if (!Selection.has(this.name)) return;

  this.active();

  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(
    charIDToTypeID('Chnl'),
    charIDToTypeID('Ordn'),
    charIDToTypeID('Trgt')
  );
  desc.putReference(charIDToTypeID('null'), ref);
  executeAction(charIDToTypeID('Dlt '), desc, DialogModes.NO);
};
