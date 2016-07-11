/**
 * 对话框
 */

(function($, util){

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
    onClick: function(inst, i){},
    closeBlur: true, //点击对话框外面区域关闭对话框
    closeEsc: true, //按下 esc 关闭对话框
    mask: true, //是否显示遮罩层
    hashTracking: true //跟踪hashchange
  };

  /**
   * 当前对话框
   */
  var current;

  /**
   * 对话框实例
   * @param $wrapper
   * @param options
   * @constructor
   */
  function Dialog($wrapper, options){
    var inst = this;

    inst.options = $.extend({}, DEFAULT, options);
    inst.state = 'closed';

    inst.$wrapper = $wrapper;
    inst.$dialog = $wrapper.find('.md-dialog');

    // 绑定按钮点击事件
    inst.$wrapper.find('.md-dialog-buttons .md-btn').each(function(i, el){
      $(el).on('click.buttons.dialog.mdui', function(){
        inst.options.onClick(inst, i);
      });
    });

    // 点击对话框外面关闭对话框
    inst.$wrapper.on('click.wrapper.dialog.mdui', function(e){
      var $target = $(e.target);
      if(!$target.hasClass('md-dialog-wrapper')){
        return;
      }

      if(inst.options.closeBlur){
        inst.close();
      }
    });
  }

  /**
   * 打开对话框
   */
  Dialog.prototype.open = function(){
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      return;
    }

    if(current && current !== inst){
      current.close();
    }

    current = inst;

    inst.$wrapper.addClass('md-dialog-in');
    var _temp = window.getComputedStyle(inst.$dialog[0]).opacity; //使动态添加的元素的 transition 动画能生效
    inst.$dialog.removeClass('md-dialog-out').addClass('md-dialog-in');
    util.lockScreen();

    inst.state = 'opening';
    inst.$wrapper.trigger('opening.dialog.mdui', [inst]);

    util.transitionEnd(inst.$dialog, function(){
      inst.state = 'opened';
      inst.$wrapper.trigger('opened.dialog.mdui', [inst]);
    });

    if(inst.options.mask){
      util.showMask(300);
    }

    if(inst.options.hashTracking){
      // 如果 hash 中原来就有 &md-dialod，先删除，避免后退历史纪录后仍然有 &md-dialog 导致无法关闭
      var hash = location.hash.substring(1);
      if(hash.indexOf('&md-dialog') > -1){
        hash = hash.replace(/&md-dialog/g, '');
      }

      // 后退按钮关闭对话框
      location.hash = hash + '&md-dialog';
      $(window).on('hashchange.dialog.mdui', function(e){
        if(location.hash.substring(1).indexOf('&md-dialog') < 0){
          inst.close(true);
        }
      });
    }
  };

  /**
   * 关闭对话框
   */
  Dialog.prototype.close = function(){
    var inst = this;

    if(inst.state === 'closing' || inst.state === 'closed'){
      return;
    }

    inst.$dialog.removeClass('md-dialog-in').addClass('md-dialog-out');
    inst.state = 'closing';
    inst.$wrapper.trigger('closing.dialog.mdui', [inst]);

    util.transitionEnd(inst.$dialog, function(){
      inst.$wrapper.removeClass('md-dialog-in');
      inst.state = 'closed';
      inst.$wrapper.trigger('closed.dialog.mdui', [inst]);
      util.unlockScreen();

      // if(inst.options.destroyClose){
      //   inst.destroy();
      // }
    });

    if(inst.options.mask){
      util.hideMask();
    }

    if(inst.options.hashTracking){
      // 是否需要后退历史纪录，默认为false。
      // 为false时是通过js关闭，需要后退一个历史记录
      // 为true时是通过后退按钮关闭，不需要后退历史记录
      if(!arguments[0]){
        window.history.back();
      }
      $(window).off('hashchange.dialog.mdui');
    }
  };

  /**
   * 切换对话框的打开/关闭状态
   */
  Dialog.prototype.toggle = function(){
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      inst.close();
    }
    if(inst.state === 'closing' || inst.state === 'closed'){
      inst.open();
    }
  };

  /**
   * 获取对话框状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Dialog.prototype.getState = function(){
    return this.state;
  };

  /**
   * 销毁对话框
   */
  /*Dialog.prototype.destroy = function(){
    var inst = this;

    inst.$wrapper.removeClass('md-dialog-in');
    util.unlockScreen();
    util.hideMask();

    inst.$wrapper.remove();
  };*/

  // esc 按下时关闭对话框
  $(document).on('keydown.escape.dialog.mdui', function(e){
    if(current && current.options.closeEsc && current.state === 'opened' && e.keyCode === 27){
      current.close();
    }
  });

  // jQuery 插件
  $.fn.mduiDialog = function(option){
    var inst;
    this.each(function(){
      var $this = $(this);
      inst = $this.data('dialog-inst-mdui');

      if(!inst){
        var options = $.extend(
            {},
            util.parseOptions($this.data('md-options-dialog')),
            typeof option === 'object' && option
        );

        inst = new Dialog($this, options);
        $this.data('dialog-inst-mdui', inst);
      }
    });

    return inst;
  };

  $(function(){

    // DATA-API

    $(document).on('click.dialog.data-api.mdui', '[data-md-model="dialog"]', function(e){
      var $this = $(this);
      var options = util.parseOptions($this.data('md-options-dialog'));
      var $target = $(options.target);

      if($this.is('a')){
        e.preventDefault();
      }

      $target.mduiDialog(options).open();
    });
  });

})($, util);