function History() {
  this.state = -1;
}

History.previous = function () {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(
    charIDToTypeID('HstS'),
    charIDToTypeID('Ordn'),
    charIDToTypeID('Prvs')
  );
  desc.putReference(charIDToTypeID('null'), ref);
  executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
};

History.next = function () {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(
    charIDToTypeID('HstS'),
    charIDToTypeID('Ordn'),
    charIDToTypeID('Nxt ')
  );
  desc.putReference(charIDToTypeID('null'), ref);
  executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
};

History.last = function () {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(
    charIDToTypeID('HstS'),
    charIDToTypeID('Ordn'),
    charIDToTypeID('Lst ')
  );
  desc.putReference(charIDToTypeID('null'), ref);
  executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
};

History.delete = function () {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putProperty(charIDToTypeID('HstS'), charIDToTypeID('CrnH'));
  desc.putReference(charIDToTypeID('null'), ref);
  executeAction(charIDToTypeID('Dlt '), desc, DialogModes.NO);
};
