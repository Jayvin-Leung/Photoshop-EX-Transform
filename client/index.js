var csInterface = new CSInterface();
var theme = null;

(function (flies) {
  var lib = csInterface.getSystemPath(SystemPath.EXTENSION) + '/host/lib';
  for (var i = 0; i < flies.length; i++) {
    csInterface.evalScript(`$.evalFile('${lib}/${flies[i]}');`);
  }
})(['Layer.jsx', 'Selection.jsx', 'History.jsx']);

function getTheme(bgColor) {
  var red = Math.round(bgColor.red);
  var theme;
  if (red < 60) {
    theme = 'darkest';
  } else if (60 <= red && red < 127) {
    theme = 'dark';
  } else if (127 <= red && red < 200) {
    theme = 'gray';
  } else {
    theme = 'white';
  }
  return theme;
}

function syncTheme() {
  var skinInfo = csInterface.getHostEnvironment().appSkinInfo;
  var bgColor = skinInfo.panelBackgroundColor.color;
  document.body.style.backgroundColor = `rgb(${bgColor.red}, ${bgColor.green}, ${bgColor.blue})`;
  document.querySelector('#ex-transform').classList.remove('btn-transform-' + theme);
  theme = getTheme(bgColor);
  document.querySelector('#ex-transform').classList.add('btn-transform-' + theme);
}

window.addEventListener('load', () => {
  syncTheme();
  csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, () => {
    syncTheme();
  });
});

csInterface.addEventListener('commit', function (data) {
  csInterface.evalScript(`afterCommit(${JSON.stringify(data.data)})`, function (result) {
    if (result !== 'true') alert('出错了！尝试联系一下作者！！');
  });
});

csInterface.addEventListener('cancel', function (data) {
  csInterface.evalScript(`afterCancel(${JSON.stringify(data.data)})`, function (result) {
    if (result !== 'true') alert('出错了！尝试联系一下作者！！');
  });
});

document.querySelector('#ex-transform').addEventListener('click', function () {
  csInterface.evalScript('transform()', function (result) {
    if (result !== 'true') alert('出错了！尝试联系一下作者！！');
  });
});
