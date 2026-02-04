try {
transform.OnReady(function() {

    this.effects = [
        {value:'none', title: 'None'},
        {value:'fade', title: 'Fade'},
        {value:'slide', title: 'Slide'},
    ];


    transform.ItemAdd({
        id: 'hamburger',
        name: 'Hamburger Menu',
        options: {
            a: {'label': 'Menu ID', 'type': 'INPUT', 'value': ''},
            b: {'label': 'Animation', 'type': 'SELECT', 'values': this.effects, 'value': 'fade'},
            c: {'label': 'Show', 'type': 'TOGGLE', 'value': false},
            d: {'label': 'Flex on show', 'type': 'TOGGLE', 'value': false},
        },

        code: function(transform, tag, target, options, data, index) {

            this.init = (bind, num) => {
                this.requirements();
                this.render();

                if(data.mode === 'website') {
                    this.click();
                }
            };

            this.requirements = () => {
                if(!options.a ) {
                    console.log(`Menu ID is not set.`);
                    return;
                }

                if( !$(`#${options.a}`).length ) {
                    console.log(`Menu with an id: ${options.a} doesn't exist.`);
                    return;
                }
            };

            this.render = () => {
                if (options.c ) {
                    target.addClass('dh-active');
                    $(`#${options.a}`).addClass("dh-active");
                    if (options.d) {
                        $(`#${options.a}`).css('display', 'flex');
                        return;
                    }
                    $(`#${options.a}`).show();
                }
            };

            this.click = () => {
                let transform = this;
                $(target).on("click", function(){
                    transform.menuToggle($(this));
                })
            };

            this.menuToggle = (button) => {

                $(button).toggleClass("dh-active");
                $(`#${options.a}`).toggleClass("dh-active");

                if (options.b === "none") {
                    let isVis = $(`#${options.a}`).is(":visible");
                    if (options.d ) {
                        if ( isVis ) {
                            $(`#${options.a}`).hide();
                        } else {
                            $(`#${options.a}`).css("display", "flex");
                        }
                    } else {
                        $(`#${options.a}`).toggle();
                    }
                } else if (options.b === "fade") {
                    if (options.d ) {
                        $(`#${options.a}`).fadeToggle("fast").css('display', 'flex');
                    } else {
                        $(`#${options.a}`).fadeToggle("fast");
                    }
                } else if (options.b === "slide") {
                    if (options.d ) {
                        $(`#${options.a}`).slideToggle("fast").css('display', 'flex');
                    } else {
                        $(`#${options.a}`).fadeToggle("fast");
                    }
                }
            }


            return this;
        }
    });
});
} catch (error) { console.log(error); }

try {
transform.OnReady(function()
{
    this.anims =  [
        {value: 'none', title: 'None'},
        {value: 'fade', title: 'Fade'},
    ];

    this.bars = [
        {value: 'none', title: 'None'},
        {value: 'horizontal', title: 'Horizontal'},
        {value: 'vertical', title: 'Vertical'},
    ];

    let tabs = {};
    let callbacks = [];
    let intervals = {};

    $(window).on('scroll', () => 
    {
        callbacks.forEach((callback) =>
        {
            callback();
        });
    });

    $(document).on('dh/pages/unload', (event, page) =>
    {
        callbacks = [];
        intervals = {}
    });


    transform.ItemAdd({
        id: 'tabs',
        name: 'Tabs',
        options: {
            a: {'label': 'Opened Tab', 'type': 'INPUT', 'value': '1'},
            b: {'label': 'Animation', 'type': 'SELECT', 'values': this.anims, 'value': 'fade'},
            c: {'label': 'Duration (ms)', 'type': 'INPUT', 'value': 250},

            f: {'label': 'Prev Class', 'type': 'INPUT', 'value': '', 'group': "Navigation (Arrows)"},
            e: {'label': 'Next Class', 'type': 'INPUT', 'value': '', 'group': "Navigation (Arrows)"},

            aa: {'label': 'Enable', 'type': 'TOGGLE', 'value': false, 'group': "Autoplay"},
            ab: {'label': 'Delay (s)', 'type': 'INPUT', 'value': 5, 'group': "Autoplay"},
            ac: {'label': 'Disable on Interaction', 'type': 'TOGGLE', 'value': false, 'group': "Autoplay"},
            ad: {'label': 'Progress Bar', 'type': 'SELECT', 'values': this.bars, 'value': 'none', 'group': "Autoplay"},
            ae: {'label': 'Progress Bar Color', 'type': 'INPUT', 'value': "#000", 'group': "Autoplay"},
        },

        code: function(transform, tag, target, options, data, index)
        {

            if(data.mode === 'builder') {
                options.aa = false;
                options.b = "none";
            } 


            this.init = (bind, num) =>
            {

                this.setTabsDefaults(target, options);
                this.render();

                if (options.aa) {
                    this.autoplayStart(target);
                  
                    callbacks.push(() => {
                        this.autoplayStart(target);
                    }); 
                }

                if(data.mode === 'website')
                {
                    this.navigation(target);
                    this.click(target);
                }
            };

            this.render = () =>
            {
               
                let initTab = options.a;
                if (!initTab) {initTab = 1;}
                if (initTab === "*" && data.mode === "builder") {
                    return;
                }

                initTab = isNaN(parseInt(initTab)) ? 1 : parseInt(initTab);
                target.children().eq(1).children().hide();

                this.openTab(target, initTab - 1, false); 
            };

            /* DEFAULTS */
            this.setTabsDefaults = (target, options) => {
                let microtime = new Date().getTime(); 
                let randomNum = Math.floor(Math.random() * 10000); 
                let uniqueId = microtime + '_' + randomNum; 
                let className = "dh-tabs_"+uniqueId;
                $(target).addClass(className);
                $(target).attr("data-transform","tabs");
                $(target).attr("data-tabs-class", className);
                tabs[className] = {target, options};
            }


            /* ACTIONS */
            this.click = (target) =>
            {
               let transform = this;
                target.children().first().children().click(function()
                {
                    if ($(this).hasClass('dh-active')) {
                        return;
                    }

                    transform.openTab(target, $(this).index());
                });
            };

            this.openTab = (target, index, userClick = true) =>
            {   
                let tabs_id = $(target).attr("data-tabs-class");
                let options = tabs[tabs_id].options;

                /* reset autoplay if user clicks on tab, disable */
                if (options.aa && userClick) {
                    this.resetAutoplay(userClick && options.ac, target);
                }
             
                /* Set active to navigation */  
                target.children().first().children().removeClass('dh-active');        
                setTimeout(function(){
                    target.children().first().children().eq(index).addClass('dh-active');
                }, 1)

                /* Open tab content with index */
                switch (options.b)
                {
                    case 'fade':
                        this.animationFade(target, index);
                        break;
                    default:
                        this.animationNone(target, index);
                        break;
                }
            }

            /* ANIMATIONS */
            this.animationNone = (target, index) =>
            {
                let active = target.children().eq(1).find('> .dh-active');
                let content = target.children().eq(1).children().eq(index);
                active.hide();
                content.show();
                
                target.children().eq(1).find('> .dh-active').removeClass('dh-active');
                target.children().eq(1).children().eq(index).addClass('dh-active');
            };

            this.animationFade = (target, index) =>
            {
                let active = target.children().eq(1).find('> .dh-active');
                let content = target.children().eq(1).children().eq(index);

                $(active).hide();
                $(content).fadeIn();

                target.children().eq(1).find('> .dh-active').removeClass('dh-active');
                target.children().eq(1).children().eq(index).addClass('dh-active');
            };




            /* AUTOPLAY */
            this.autoplay = (target) => {

                let tabs_id = $(target).attr("data-tabs-class");
                let options = tabs[tabs_id].options;
                let transform = this;
                let totalTabs = target.children().first().children().length;
            
                intervals[tabs_id] = setInterval(() => {
                    let currentIndex = target.children().first().find('> .dh-active').index();
                    let nextIndex = (currentIndex + 1) % totalTabs;
                    transform.openTab(target, nextIndex, false);
                }, options.ab * 1000);
            };


            this.autoplayStart = (target) => {
                let isLoaded = $(target).attr("data-tabs-loaded");
                if (!isLoaded && this.inViewport(target)) {
                    $(target).attr("data-tabs-loaded", "true");
                    
                    let activeNav = $(target).children().first().find(".dh-active");
                    $(activeNav).removeClass('dh-active');  
                    setTimeout(()=> {
                       $(activeNav).addClass('dh-active');    
                    }, 1)  
                    this.autoplay(target);
                    this.progressBar(target);
                } 
            }

            this.resetAutoplay = (disableOnInteraction, target) => {

                let tab_name = $(target).attr("data-tabs-class");
                clearInterval(intervals[tab_name]);
                intervals[tab_name] = null;

                if (!disableOnInteraction) {
                    this.autoplay(target);
                } else {
                    this.stopProgressBar(target);
                }  
            };

            this.inViewport = (target) => {
                let rect = target[0].getBoundingClientRect();
                return rect.bottom > 0 &&
                    rect.right > 0 &&
                    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
                    rect.top < (window.innerHeight || document.documentElement.clientHeight);
            }


            /* AUTOPLAY PROGRESS BAR */

            this.progressBar = (target) => {

                let tab_id = $(target).attr("data-tabs-class");
                let options = tabs[tab_id].options;


                if (options.ad === "none") { return; }
                if (!target.children().first().find('> *').find(".progress-bar").length) { 
                    let message =  `Div with the class "progress-bar" inside tabs doesnt exist.`;
                    mdBugs.ItemAdd({message}); 
                    return; 
                }

                let css = "width:0%;height:100%;";
                let cssSide = "width";
                if ( options.ad === "vertical") {
                    css = "height:0%;width:100%;";
                    cssSide = "height";
                }

                let line_color = options.ae;
                let progress_line = `<div style="background:${line_color}; position:absolute;left:0;top:0;${css}"></div>`
                target.children().first().find('> *').find(".progress-bar").append(progress_line);

                if ( !options.aa  ) { options.ab = "0";}
                let style = `
                    <style id="style-dh-tabs-progressBar">
                        .${tab_id} .dh-active .progress-bar > div {
                            ${cssSide}: 100%!important;
                            transition:${options.ab}s all cubic-bezier(.25, .46, .45, .94);
                        }
                    </style>
                `;
                $(target).append(style);
            }


            this.stopProgressBar = (target) => {

                let tab_id = $(target).attr("data-tabs-class");
                let options = tabs[tab_id].options;

                let cssSide = "width";
                if ( options.ad === "vertical") {
                    cssSide = "height";
                }

                $(target).find("#style-dh-tabs-progressBar").remove();
                let style = `
                    <style id="style-dh-tabs-progressBar">
                        .${tab_id} .dh-active .progress-bar > div {
                            ${cssSide}: 100%!important;
                            transition:0s all cubic-bezier(.25, .46, .45, .94);
                        }
                    </style>
                `;
                $(target).append(style);
            }


            /* NAVIGATION */
            this.navigation = (target) =>
            {
                /* Prev */
                if(options.f.length)
                {
                    
                    let hold_target = target;
                    let transform = this;
                    $(target).find('.' + options.f).on("click", function(){
                        let total = $(this).closest("[data-transform='tabs']").find(">*").first().find(">*").length - 1;
                        let current = $(this).closest("[data-transform='tabs']").find(">*").first().find('> .dh-active').index();
                        let prev = current - 1;
                        if (prev < 0) {
                            prev = total;
                        }

                        transform.openTab(hold_target, prev, true);
                    });
                }

                /* Next */
                if(options.e.length)
                {
                    let hold_target = target;
                    let transform = this;
                    $(target).find('.' + options.e).on("click", function(){
                        
                        let total = $(this).closest("[data-transform='tabs']").find(">*").first().find(">*").length - 1;
                        let current = $(this).closest("[data-transform='tabs']").find(">*").first().find('> .dh-active').index();

                        let next = current + 1;
                        if (next > total) {
                            next = 0;
                        }

                        transform.openTab(hold_target, next, true);
                    });
                }
            };

            return this;
        }
    });
});
} catch (error) { console.log(error); }

