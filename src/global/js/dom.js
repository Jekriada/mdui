/**
 * Dom 操作库
 * @type {Function}
 *
 * Inspired by https://github.com/nolimits4web/Framework7
 * https://github.com/nolimits4web/Framework7/blob/master/LICENSE
 */
(function () {
  /**
   * 是否是数组
   * @param arr
   * @returns {boolean}
   */
  $.isArray = function (arr) {
    return Object.prototype.toString.apply(arr) === '[object Array]';
  };

  /**
   * nodeList 转换为数组
   * @param nodeList
   * @returns {Array}
   */
  $.toArray = function (nodeList) {
    var i, arr = [];
    for (i = 0; i < nodeList.length; i++) {
      if (nodeList[i]) {
        arr.push(nodeList[i]);
      }
    }
    return arr;
  };

  /**
   * 循环数组或对象
   * @param obj
   * @param callback
   */
  $.each = function (obj, callback) {
    var i, prop;
    if(!obj){
      return;
    }
    if ($.isArray(obj)) {
      // Array
      for (i = 0; i < obj.length; i++) {
        callback(i, obj[i]);
      }
    } else {
      // Object
      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          callback(prop, obj[prop]);
        }
      }
    }
  };

  /**
   * 去除数组中的重复值
   * @param arr
   * @returns {Array}
   */
  $.unique = function (arr) {
    var unique = [];
    for (var i = 0; i < arr.length; i++) {
      if (unique.indexOf(arr[i]) === -1) {
        unique.push(arr[i]);
      }
    }
    return unique;
  };

  var _queueData = [];
  /**
   * 写入队列
   * @param name 队列名
   * @param func 函数名，没有函数名时，返回所有队列
   */
  $.queue = function (name, func) {
    if (typeof _queueData[name] === 'undefined') {
      _queueData[name] = [];
    }
    if (typeof func === 'undefined') {
      return _queueData[name];
    }
    _queueData[name].push(func);
  };

  /**
   * 从队列中移除一个函数，并执行该函数
   * @param name 队列名
   */
  $.dequeue = function (name) {
    if (_queueData[name].length) {
      (_queueData[name].shift())();
    }
  };

  /**
   * 合并参数
   * @param defaults
   * @param params
   * @returns {*}
   */
  $.extend = function(defaults, params){
    for(var def in defaults){
      if(defaults.hasOwnProperty(def) && typeof params[def] === 'undefined'){
        params[def] = defaults[def];
      }
    }
    return params;
  };

  /**
   * 从元素获取数据
   * @param dom
   * @param key
   * @returns {*}
   */
  $.getData = function (dom, key) {
    if (dom.domDataStorage && (key in dom.domDataStorage)) {
      return dom.domDataStorage[key];
    } else {
      return null;
    }
  };

  /**
   * 将数据附加到元素上
   * @param dom
   * @param key
   * @param value
   */
  $.setData = function (dom, key, value) {
    if (!dom.domDataStorage) {
      dom.domDataStorage = {};
    }
    dom.domDataStorage[key] = value;
  };

  /**
   * 删除元素上的数据
   * @param dom
   * @param key
   */
  $.removeData = function (dom, key) {
    if (dom.domDataStorage && dom.domDataStorage[key]) {
      dom.domDataStorage[key] = null;
      delete dom.domDataStorage[key];
    }
  };

  /**
   * 设置 transform 属性
   * @param dom
   * @param transform
   */
  $.transform = function (dom, transform) {
    dom.style.webkitTransform =
      dom.style.MsTransform =
        dom.style.msTransform =
          dom.style.MozTransform =
            dom.style.OTransform =
              dom.style.transform = transform;
  };

  /**
   * 设置 transition 过渡时间
   * @param dom
   * @param duration
   */
  $.transition = function (dom, duration) {
    if (typeof duration !== 'string') {
      duration = duration + 'ms';
    }
    dom.style.webkitTransitionDuration =
      dom.style.MsTransitionDuration =
        dom.style.msTransitionDuration =
          dom.style.MozTransitionDuration =
            dom.style.OTransitionDuration =
              dom.style.transitionDuration = duration;
  };

  /**
   * 执行 document.querySelectorAll，并把结果转换为数组
   * @param selector
   * @param parent
   * @returns {Array}
   */
  $.queryAll = function(selector, parent){
    if(arguments.length === 1){
      parent = document;
    }
    return $.toArray(parent.querySelectorAll(selector));
  };

  /**
   * 执行 document.querySelector
   * @param selector
   * @param parent
   * @returns {Element}
   */
  $.query = function(selector, parent){
    if(arguments.length === 1){
      parent = document;
    }
    return parent.querySelector(selector);
  };

  /**
   * 执行 document.getElementById
   * @param id
   * @param parent
   * @returns {Element}
   */
  $.queryId = function(id, parent){
    if(arguments.length === 1){
      parent = document;
    }
    return parent.getElementById(id);
  };

  /**
   * @param dom
   * @param selector
   * @returns {*}
   */
  $.is = function (dom, selector) {
    var compareWith;

    if (typeof selector === 'string') {
      if (dom === document) {
        return selector === document;
      }
      if (dom === window) {
        return selector === window;
      }
      if (dom.matches) {
        return dom.matches(selector);
      } else if (dom.webkitMatchesSelector) {
        return dom.webkitMatchesSelector(selector);
      } else if (dom.mozMatchesSelector) {
        return dom.mozMatchesSelector(selector);
      } else if (dom.msMatchesSelector) {
        return dom.msMatchesSelector(selector);
      } else {
        compareWith = $.queryAll(selector);
        return (compareWith.indexOf(dom) !== -1);
      }
    } else if (selector === document) {
      return dom === document;
    } else if (selector === window) {
      return dom === window;
    } else if(selector.nodeType) {
      return dom === selector;
    } else if(selector[0].nodeType) {
      compareWith = $.toArray(selector);
      return (compareWith.indexOf(dom) !== -1);
    }
    return false;
  };

  /**
   * 查找含有指定 css 选择器的父节点
   * @param dom
   * @param selector
   * @returns {*}
   */
  $.parent = function (dom, selector) {
    var parent = dom.parentNode;
    if (parent !== null) {
      if (selector) {
        if ($.is(parent, selector)) {
          return parent;
        }
      } else {
        return parent;
      }
    }
    return undefined;
  };

  /**
   * 查找含有指定选择器的所有父元素
   * @param dom
   * @param selector
   * @returns {Array}
   */
  $.parents = function (dom, selector) {
    var parents = [];
    var parent = dom.parentNode;
    while (parent) {
      if (selector) {
        if ($.is(parent, selector)) {
          parents.push(parent);
        }
      } else {
        parents.push(parent);
      }
      parent = parent.parentNode;
    }
    return $.unique(parents);
  };

  /**
   * 事件绑定
   * @param dom
   * @param eventName 多个事件用空格分割
   * @param targetSelector
   * @param listener
   * @param capture
   */
  $.on = function (dom, eventName, targetSelector, listener, capture) {
    // 处理委托事件
    function handleLiveEvent(e) {
      var target = e.target;
      if($.is(target, targetSelector)){
        listener.call(target, e);
      }else{
        var parents = $.parents(target);
        for(var k = 0; k < parents.length; k++){
          if($.is(parents[k], targetSelector)){
            listener.call(parents[k], e);
          }
        }
      }
    }

    var events = eventName.split(' ');
    var i;
    if (typeof targetSelector === 'function' || targetSelector === false) {
      if(typeof targetSelector === 'function'){
        listener = arguments[2];
        capture = arguments[3] || false;
      }
      for (i = 0; i < events.length; i++) {
        dom.addEventListener(events[i], listener, capture);
      }
    } else {
      //Live events
      for (i = 0; i < events.length; i++) {
        if (!dom.domLiveListeners) {
          dom.domLiveListeners = [];
        }
        dom.domLiveListeners.push({listener: listener, liveListener: handleLiveEvent});
        dom.addEventListener(events[i], handleLiveEvent, capture);
      }
    }
  };

  /**
   * 解除事件绑定
   * @param dom
   * @param eventName
   * @param targetSelector
   * @param listener
   * @param capture
   */
  $.off = function (dom, eventName, targetSelector, listener, capture) {
    var events = eventName.split(' ');
    for(var i =0; i < events.length; i++){
      if(typeof targetSelector === 'function'){
        listener = arguments[2];
        capture = arguments[3] || false;
        dom.removeEventListener(events[i], listener, capture);
      }else{
        // Live event
        if(dom.domLiveListeners){
          for(var j = 0; j < dom.domLiveListeners.length; j++){
            if(dom.domLiveListeners[j].listener === listener){
              dom.removeEventListener(events[i], dom.domLiveListeners[j].liveListener, capture);
            }
          }
        }
      }
    }
  };

  /**
   * 事件绑定，只触发一次
   * @param dom
   * @param eventName
   * @param targetSelector
   * @param listener
   * @param capture
   * @returns {*}
   */
  $.one = function(dom, eventName, targetSelector, listener, capture){
    if(typeof targetSelector === 'function'){
      listener = arguments[2];
      capture = arguments[3];
      targetSelector = false;
    }
    function proxy(e){
      listener.call(e.target, e);
      $.off(dom, eventName, targetSelector, proxy, capture);
    }
    $.on(dom, eventName, targetSelector, proxy, capture);
  };

  /**
   * 触发事件
   * @param dom
   * @param eventName
   * @param eventData
   */
  $.trigger = function(dom, eventName, eventData){
    var events = eventName.split(' ');
    for(var i =0; i < events.length; i++){
      var evt;
      try{
        evt = new CustomEvent(events[i], {detail: eventData, bubbles: true, cancelable: true});
      }catch(e){
        evt = document.createEvent('Event');
        evt.initEvent(events[i], true, true);
        evt.detail = eventData;
      }
      dom.dispatchEvent(evt);
    }
  };

  /**
   * transition 动画结束回调
   * @param dom
   * @param callback
   */
  $.transitionEnd = function (dom, callback) {
    var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
      i;
    function fireCallback(e){
      if(e.target !== dom){
        return;
      }
      callback.call(dom, e);
      for(i = 0; i < events.length; i++){
        $.off(dom, events[i], fireCallback);
      }
    }
    if(callback){
      for(i = 0; i < events.length; i++){
        $.on(dom, events[i], fireCallback);
      }
    }
  };

  /**
   * 获取元素的偏移
   * @param dom
   * @returns {{top: number, left: number}}
   */
  $.offset = function(dom){
    var box = dom.getBoundingClientRect();
    var body = document.body;
    var clientTop  = dom.clientTop  || body.clientTop  || 0;
    var clientLeft = dom.clientLeft || body.clientLeft || 0;
    var scrollTop  = window.pageYOffset || dom.scrollTop;
    var scrollLeft = window.pageXOffset || dom.scrollLeft;
    return {
      top: box.top  + scrollTop  - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  };

  /**
   * 创建 Node 数组
   * @param selector 选择器或 html 字符串
   * @returns {Array}
   */
  $.dom = function(selector){
    var tempParent;

    if(!selector){
      return [];
    }

    // String
    if(typeof selector === 'string'){
      selector = selector.trim();
      if (selector.indexOf('<') >= 0 && selector.indexOf('>') >= 0) {
        // HTML
        var toCreate = 'div';
        if (selector.indexOf('<li') === 0){
          toCreate = 'ul';
        }
        if (selector.indexOf('<tr') === 0){
          toCreate = 'tbody';
        }
        if (selector.indexOf('<td') === 0 || selector.indexOf('<th') === 0){
          toCreate = 'tr';
        }
        if (selector.indexOf('<tbody') === 0){
          toCreate = 'table';
        }
        if (selector.indexOf('<option') === 0){
          toCreate = 'select';
        }
        tempParent = document.createElement(toCreate);
        tempParent.innerHTML = selector;
        return $.toArray(tempParent.childNodes);
      }else{
        if(selector[0] === '#' &&  !selector.match(/[ .<>:~]/)){
          // ID 选择器
          return [$.queryId(selector.split('#')[1])];
        }else{
          // 其他选择器
          return $.queryAll(selector);
        }
      }
    }
    // Node
    else if(selector.nodeType || selector === window || selector === document){
      return [selector];
    }
    // Array of elements
    else if(selector.length > 0 && selector[0].nodeType){
      return $.toArray(selector);
    }

    return [];
  };

  /**
   * 获取含指定 css 的直接子元素数组
   * @param dom
   * @param selector
   * @param singleNode 是否只返回第一个元素
   * @returns {Array}
   */
  $.children = function(dom, selector, singleNode){
    var children = [];
    var childNodes = dom.childNodes;

    if(!selector){
      return singleNode ? childNodes[0] : $.toArray(childNodes);
    }

    for(var i = 0; i < childNodes.length; i++){
      if(childNodes[i].nodeType === 1 && $.is(childNodes[i], selector)){
        if(singleNode){
          return childNodes[i];
        }
        children.push(childNodes[i]);
      }
    }
    return children;
  };

  /**
   * Dom 加载完毕后
   * @param fn
   */
  $.ready = function(fn){
    document.addEventListener("DOMContentLoaded", function() {
      fn();
    });
  };

  /**
   * 解析 DATA API 参数
   * @param str
   * @returns {{}}
   */
  $.parseOptions = function (str) {
    if (!str) {
      return {};
    }

    // JSON 格式
    if(str[0] === '{'){
      return JSON.parse(str);
    }

    // 键值对格式
    var obj = {};
    var arr;
    var len;
    var val;
    var i;

    // 删除逗号和分号前后的空格
    str = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',');

    // 解析字符串
    arr = str.split(',');
    for (i = 0, len = arr.length; i < len; i++) {
      arr[i] = arr[i].split(':');
      val = arr[i][1];

      // bool 值转换
      if (typeof val === 'string' || val instanceof String) {
        val = val === 'true' || (val === 'false' ? false : val);
      }

      // 数字值转换
      if (typeof val === 'string' || val instanceof String) {
        val = !isNaN(val) ? +val : val;
      }

      obj[arr[i][0]] = val;
    }

    return obj;
  };

  /**
   * 触发插件的事件
   * @param eventName 事件名
   * @param pluginName 插件名
   * @param inst 实例
   * @param obj 事件参数
   */
  $.pluginEvent = function(eventName, pluginName, inst, obj){
    if(typeof obj === 'undefined'){
      obj = {};
    }
    var args = $.toArray(obj);
    args.unshift(inst);

    var fullEventName = eventName + '.' + pluginName + '.mdui';

    // 回调函数
    inst.options['on' + eventName[0].toUpperCase() + eventName.substring(1)].apply(inst.options, args);

    // jQuery 事件
    if(typeof jQuery !== 'undefined'){
      jQuery(inst.target).trigger(fullEventName, args);
    }

    // 原生js事件
    obj.inst = inst;
    $.trigger(inst.target, fullEventName, obj);
  };
})();