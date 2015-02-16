// ==UserScript==
// @name            Steamgifts++ Dev
// @namespace       https://github.com/leomoty/SGPP
// @version         0.2.2 beta
// @description     SG++ for Steamgifts.com
// @author          Leomoty
// @match           http://www.steamgifts.com/*
// @run-at          document-end
// @require         http://code.jquery.com/jquery-2.1.3.min.js
// @require         https://raw.githubusercontent.com/dinbror/bpopup/master/jquery.bpopup.min.js
// @grant           GM_addStyle
// ==/UserScript==
var ModuleDefinition;(function(b){var a=(function(){function c(){var d=this;this._LSPrefix="SGPP_";this.containsItem=function(e){return localStorage.getItem(d._LSPrefix+e)!=null};this.getItem=function(e){return localStorage.getItem(d._LSPrefix+e)};this.setItem=function(e,f){localStorage.setItem(d._LSPrefix+e,f)}}return c})();b.LocalStorage=a})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(a){var b=(function(){function c(){var d=this;this._debug=true;this._settings=new a.Settings();this._storage=new a.LocalStorage();this.modules={};this.log=function(e){if(d._debug){console.log("["+new Date()+"] SGPP - "+e)}};this.appendCSS=function(e){$("style").append(e)};this.style="";this.init=function(){d.log("Steamgifts++ plugin started ("+("loading"==document.readyState?"document-start":"document-end")+").");d.resolvePath();$("head").append($("<style>"));d.appendCSS("/* SGPP Stylesheet */ ");d.appendCSS(d._settings.style);d._settings.init()};this.resolvePath=function(){var j="";var q="";var f="";var o="";var l="";var i=window.location;if(i.hash.length>1){j=i.hash.substring(1)}if(i.pathname=="/"){q="giveaways"}else{var n=i.pathname.split("/").filter(function(s,r,t){return Boolean(s)});q=n[0]||"";o=n[2]||"";if(n[0]=="giveaway"||n[0]=="trade"||n[0]=="discussion"||n[0]=="user"){l=(n[3]=="search"?"":n[3])||"";f=n[1]||""}else{l=n[1]||""}}var k,h=/\+/g,p=/([^&=]+)=?([^&]*)/g,e=function(r){return decodeURIComponent(r.replace(h," "))},m=i.search.substring(1);var g={};while(k=p.exec(m)){g[e(k[1])]=e(k[2])}d._sgLocation={pageKind:q,code:f,description:o,subpage:l,hash:j,parameters:g}};this.init()}Object.defineProperty(c.prototype,"settings",{get:function(){return this._settings},enumerable:true,configurable:true});Object.defineProperty(c.prototype,"location",{get:function(){return this._sgLocation},enumerable:true,configurable:true});Object.defineProperty(c.prototype,"storage",{get:function(){return this._storage},enumerable:true,configurable:true});c.prototype.name=function(){return"Core"};c.prototype.shouldRun=function(d){return true};c.prototype.render=function(){this._settings.render()};return c})();a.Core=b})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(a){var b=(function(){function c(){this.shouldRun=function(d){return d.pageKind=="giveaway"&&d.subpage==""};this.style=".comment_submit{margin-bottom:0!important}";this.init=function(){};this.render=function(){var g=$(".js__submit-form");g.before('<div class="sidebar__entry-insert comment_submit is-hidden">Comment and Enter</div>');g.before('<div class="sidebar__entry-loading is-disabled is-hidden comment_submit"><i class="fa fa-refresh fa-spin"></i> Please wait...</div>');var f=$(".sidebar .sidebar__entry-insert");var d=$(".sidebar .sidebar__entry-delete");var e=$(".comment_submit.sidebar__entry-insert");var h=$(".comment_submit.sidebar__entry-loading");if(!f.hasClass("is-hidden")){e.removeClass("is-hidden")}f.on("click",function(){e.addClass("is-hidden");h.removeClass("is-hidden")});d.on("click",function(){h.addClass("is-hidden");e.removeClass("is-hidden")});e.on("click",function(){f.click();e.addClass("is-hidden");h.removeClass("is-hidden");var i=new MutationObserver(function(j){j.forEach(function(k){if(!$(k.target).hasClass("is-hidden")){g.closest("input[name=do]").val("comment_new");g.closest("form").submit()}})});i.observe(d[0],{attributes:true,attributeFilter:["class"]})})}}c.prototype.name=function(){return"CommentAndEnter"};return c})();a.CommentAndEnter=b})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(b){var a=(function(){function c(){var d=this;this.url="http://www.steamgifts.com/giveaway/";this.cacheCompleted=false;this.isLoading=false;this.commenters={};this.pageStart=1337;this.elements={button:$(document.createElement("i")).addClass("giveaway__icon fa fa-comments-o").attr("title","Check who commented"),loader:$(document.createElement("i")).addClass("giveaway__icon fa fa-refresh fa-spin").attr("title","loading comments").css("cursor","auto"),pos:$(document.createElement("span")).addClass("GAComm_pos fa-stack").attr("title","Commented").append($(document.createElement("i")).addClass("fa fa-comment-o fa-stack-1x")).append($(document.createElement("i")).addClass("fa fa-check fa-stack-1x")),neg:$(document.createElement("span")).addClass("GAComm_neg fa-stack").attr("title","Did not comment").append($(document.createElement("i")).addClass("fa fa-comment-o fa-stack-1x")).append($(document.createElement("i")).addClass("fa fa-times fa-stack-1x"))};this.style=".GAComm_pos, .GAComm_neg {margin-left:-3px; vertical-align: inherit}\n.GAComm_pos > i.fa.fa-check {color: #719A47}\n.GAComm_neg > i.fa.fa-times {color: rgba(166, 93, 92, 0.85)}\n.GAComm_pos > i.fa.fa-check, .GAComm_neg > i.fa.fa-times {font-size: 0.7em}";this.render=function(){d.elements.button.click(d.main);$(".page__heading__breadcrumbs").append(d.elements.button);$(".page__heading__breadcrumbs").append(d.elements.loader.hide())};this.main=function(){if(!d.cacheCompleted){if(!d.isLoading){d.elements.button.hide();d.elements.loader.show();d.isLoading=true;d.getCommenters()}setTimeout(d.main,1000);return}d.elements.loader.hide();d.elements.button.show();$(".table__rows .table__column--width-fill").each(function(e,f){$(".GAComm_pos, .GAComm_neg",f).remove();var g=$("p.table__column__heading",f);if(g.length>0){f=g[0]}if(d.commenters[f.textContent.trim()]){d.elements.pos.clone().appendTo(f)}else{d.elements.neg.clone().appendTo(f)}})};this.getCommenters=function(){d.url+=SGPP.location.code+"/"+SGPP.location.description+"/search?page=";d.page=d.pageStart;d.getCommentPage()};this.getCommentPage=function(){$.ajax({type:"GET",url:d.url+d.page,success:d.handleCommentPage})};this.handleCommentPage=function(g){var e=$(g);$(".comment__username",e).each(function(h,j){d.commenters[j.textContent.trim()]=true});if(d.page==d.pageStart){var f=$("a[data-page-number]",e);d.page=f.length!=0?f.last().data().pageNumber:1}if(--d.page>0){d.getCommentPage()}else{d.cacheCompleted=true}}}c.prototype.init=function(){};c.prototype.name=function(){return"EntryCommenters"};c.prototype.shouldRun=function(d){return d.pageKind=="giveaway"&&(d.subpage=="entries"||d.subpage=="winners")};return c})();b.EntryCommenters=a})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(b){var a=(function(){function c(){this.style="body.SPGG_FixedNavbar {padding-top: 39px}\nheader.SPGG_FixedNavbar {position: fixed; top: 0px; width: 100%; z-index: 100}\n.comment__summary { margin-top: -44px !important; padding-top: 48px !important; }\n.comment__actions__button { position: relative; z-index: 99; } ";this.shouldRun=function(d){return true}}c.prototype.init=function(){};c.prototype.render=function(){$("body").addClass("SPGG_FixedNavbar");$("header").addClass("SPGG_FixedNavbar")};c.prototype.name=function(){return"FixedNavbar"};return c})();b.FixedNavbar=a})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(b){var a=(function(){function c(){this.style="body.SGPP_FixedFooter {padding-bottom: 45px}\n.footer__outer-wrap.SGPP_FixedFooter_outerWrap {padding: 15px 0px; z-index: 100; bottom: 0px; position: fixed; width: 100%; background: inherit}\n.footer__inner-wrap.SGPP_FixedFooter_innerWrap {margin: 0px 25px}\n";this.shouldRun=function(d){return true}}c.prototype.init=function(){};c.prototype.render=function(){$("body").addClass("SGPP_FixedFooter");$(".footer__outer-wrap").addClass("SGPP_FixedFooter_outerWrap");$(".footer__inner-wrap").addClass("SGPP_FixedFooter_innerWrap")};c.prototype.name=function(){return"FixedFooter"};return c})();b.FixedFooter=a})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(a){var b=(function(){function c(){var d=this;this.shouldRun=function(e){return e.pageKind=="giveaways"&&["created","entered","won"].indexOf(e.subpage)==-1};this.style=".gridview_flex{display:flex;flex-wrap:wrap;justify-content:center;margin:0 -5px;}.global__image-outer-wrap--missing-image {height:69px!important}.preview{box-shadow:1px 1px 0 #fff inset,0 7px 7px rgba(255,255,255,.37)inset;background-color:rgba(255,255,255,1);border:1px solid #cbcfdb;padding:5px; z-index:10;}.tile_view_header{min-height:35px;margin-top:5px;font-size:12px}.tile_view_avatar_outer{float:right;display:inline-block;margin-left:5px}.tile_view_avatar{height:24px;width:24px;padding: 2px}.tile_view_faded{opacity:.4}.sidebar--wide{min-width:329px!important}";this.init=function(){};this.render=function(){var e=$(".pagination").prev();e.parent().on("DOMNodeInserted",function(f){if($(f.target).hasClass("pagination__navigation")){d.updateGridview($(".pagination").prev())}});d.updateGridview(e)};this.updateGridview=function(f){var g=$(document.createElement("div")).wrapInner(f.children(".giveaway__row-outer-wrap"));var e=d.generateGridview(g);f.remove(".giveaway__row-outer-wrap").addClass("SGPP__Gridview").append(e)};this.generateGridview=function(f){function g(j,h){var i=(+(parseFloat(j)/parseFloat(h))*100);return Math.min(i,100).toFixed(2)}var e=document.createElement("div");$(e).addClass("gridview_flex");$(f).find(".giveaway__row-inner-wrap").each(function(){if($(this).parents(".pinned-giveaways").length!=0){return}var h=document.createElement("div");$(this).children(".global__image-outer-wrap--game-medium").removeClass("global__image-outer-wrap--missing-image").children().first().wrap(document.createElement("div")).parent().addClass("global__image-outer-wrap--missing-image");$(h).append($(this).find(".global__image-outer-wrap--game-medium"));$(h).css("margin","5px");var m=$('<div class="gridview_extra is-hidden preview" style="position:absolute; width:184px;margin-left:-5.8px; border-top: thick #ffffff;"></div>');var r=$(this).find(".giveaway__heading__name").text();var s=$(this).find(".global__image-outer-wrap--avatar-small");s.addClass("tile_view_avatar");var k="0";var l="0";if($(this).find(".giveaway__heading__thin").length==1){l=$(this).find(".giveaway__heading__thin").text().replace("(","").replace(")","");k="1"}else{l=$(this).find(".giveaway__heading__thin:nth(1)").text().replace("(","").replace(")","");k=$(this).find(".giveaway__heading__thin:nth(0)").text().replace("(","").replace("Copies)","")}var o=$(this).find(".fa-clock-o").next().text();var i=o.split(" ");var n=$(this).find(".fa-tag").next().text();var j=n.split(" ");var q=$(this).find(".fa-comment").next().text();var t=q.split(" ");var p=g(k,n.replace(",",""));if($(this).hasClass("is-faded")){$(h).find(".global__image-outer-wrap--missing-image").addClass("tile_view_faded")}m.append('<div class="giveaway__heading__name tile_view_header">'+r+"</div>");m.append('<div class="tile_view_avatar_outer">'+s[0].outerHTML+"</div>");m.append('<div style="float:left;"><strong>'+k+"</strong> Copies</div>");m.append('<div style="float:right;"><strong>'+l+"</strong></div>");m.append('<div style="clear:both;"></div>');if(i[0]==="Ended"){m.append('<div style="margin-top:-14px;"><strong>'+i[0]+"</strong></div>")}else{m.append('<div style="margin-top:-14px;"><strong>'+i[0]+"</strong> "+i[1]+"</div>")}m.append('<div style="clear:both;"></div>');m.append('<div style="float:left;"><strong>'+j[0]+"</strong> Entries</div>");m.append('<div style="float:right;"><strong>'+p+"</strong>% Chance</div>");m.append('<div style="clear:both;"></div>');m.append("<div><strong>"+t[0]+"</strong> Comments</div>");$(h).children().first().append(m);$(e).append(h)});$(e).append($('<div style="margin-top: 5px; margin-bottom: 20px;width: 0px;height: 69px;"></div>'));$(e).find(".global__image-outer-wrap--game-medium").hover(function(){$(this).find(".gridview_extra").removeClass("is-hidden")},function(){$(this).find(".gridview_extra").addClass("is-hidden")});return e}}c.prototype.name=function(){return"GridView"};return c})();a.GridView=b})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(b){var a=(function(){function c(){this.style="";this.shouldRun=function(d){return false}}c.prototype.init=function(){};c.prototype.render=function(){};c.prototype.name=function(){return"LivePreview"};return c})();b.LivePreview=a})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(b){var a=(function(){function c(){this.style="";this.shouldRun=function(d){return true}}c.prototype.init=function(){};c.prototype.render=function(){var j=$(".sidebar");var n=$(document.createElement("div")).addClass(j.attr("class"));var o=j.wrapInner(n).children().first().addClass("SGPP__scrollingSidebar");var m=o.children(".adsbygoogle");var h=(function(){var p;return function(q){clearTimeout(p);p=setTimeout(function(){if(q){m.stop().slideUp()}else{m.stop().slideDown()}},250)}})();var f=$(window);var l=$(".footer__outer-wrap").outerHeight();var k=$(".page__inner-wrap .widget-container");var g=$(".featured__container").height();var i=25;var e=0;if(SGPP.modules.FixedNavbar!==undefined){i+=$("header").outerHeight()}else{e+=$("header").outerHeight()}$(".featured__inner-wrap .global__image-outer-wrap img").on("load",document,function(){g=$(".featured__container").height()});var d=function(){var p=f.scrollTop();if(p+o.height()>=k.position().top+k.height()){o.css({position:"fixed",top:"",bottom:l});h(true)}else{if(p<=g+e){o.css({position:"static",top:"",left:""});h(false)}else{o.css({position:"fixed",top:i,bottom:""}).show();h(true)}}};d();$(document).scroll(d)};c.prototype.name=function(){return"ScrollingSidebar"};return c})();b.ScrollingSidebar=a})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(b){var a=(function(){function c(){var d=this;this.style="";this.settingsNavIcon='<a class="nav__row SGPP__settings">\n<i class="icon-red fa fa-fw fa-bars"> </i>\n<div class="nav__row__summary">\n<p class="nav__row__summary__name" > SG++ Settings</p>\n<p class="nav__row__summary__description"> Steamgifts++ settings.</p>\n</div>\n</a>\n';this.settingsPage=function(e){return'<div class="popup SGPP__settings_popup">\n<p class="popup__heading">Steamgifts++ Settings</p>\n<div class="form__rows" style="max-height:500px; overflow-y:scroll; overflow-x:hidden; min-width:400px;">'+e+'</div>\n<p class="popup__actions" style="margin-top:5px;">\n<span class="SGPP__settings-save b-close">Save</span>\n<span class="b-close">Close</span>\n</p>\n</div>\n'};this.moduleSetting=function(f,g,e,h){return'<div class="form__row" style="margin-bottom:10px;">\n<div class="form__heading"><div class="form__heading__number">'+f+'</div><div class="form__heading__text">'+g+'</div></div>\n<div class= "form__row__indent">\n<div>\n<input type="hidden" name="'+e+'" value="'+(h?"1":"0")+'">\n<div class= "SGPP__settings-checkbox '+(h?"is-selected":"is-disabled")+'">\n<i class= "form__checkbox__default fa fa-circle-o"> </i><i class="form__checkbox__hover fa fa-circle"> </i><i class= "form__checkbox__selected fa fa-check-circle"> </i>Enabled\n</div>\n</div>\n</div>\n</div>\n'};this.init=function(){};this.render=function(){$(".nav__absolute-dropdown a[href^='/?logout']").before(d.settingsNavIcon);var e="";var f=0;for(var j in modulesNames){f++;var h=new b[modulesNames[j]]();e+=d.moduleSetting(f,h.name(),modulesNames[j],d.isModuleEnabled(modulesNames[j]))}var g=d.settingsPage(e);$(".footer__outer-wrap").before(g);$(".SGPP__settings").on("click",d.handleSettingClick);$(".SGPP__settings-save").on("click",d.handleSaveSettings);$(".SGPP__settings-checkbox").on("click",d.handleSettingsCheckboxClick)};this.handleSettingsCheckboxClick=function(){var e=$(this).siblings("input");if($(this).hasClass("is-selected")){$(this).removeClass("is-selected");$(this).addClass("is-disabled");e.val("0")}else{$(this).removeClass("is-disabled");$(this).addClass("is-selected");e.val("1")}};this.handleSettingClick=function(){var e=$(".SGPP__settings_popup").bPopup({opacity:0.85,fadeSpeed:200,followSpeed:500,modalColor:"#3c424d"});$(".SGPP__settings_popup .SGPP__settings-checkbox").addClass("form__checkbox")};this.handleSaveSettings=function(){$(".SGPP__settings_popup input").each(function(f,g){var e=$(g);SGPP.storage.setItem(e.attr("name"),e.val())})};this.shouldRun=function(e){return true};this.isModuleEnabled=function(e){return SGPP.storage.getItem(e)=="1"}}c.prototype.name=function(){return"Settings"};return c})();b.Settings=a})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(a){var c=(function(){function d(e){this._isDataStored=false;this.localStorageKey="endless_scroll_"+e;if(this.localStorageKey in localStorage){this._obj=JSON.parse(localStorage[this.localStorageKey]);if(!("numberOfComments" in this._obj)){this._obj.numberOfComments=0}if(!("lastSeenPage" in this._obj)){this._obj.lastSeenPage=0}this._isDataStored=true}else{this._obj={lastVisit:Date.now(),lastCommentIDPages:{},numberOfComments:0}}}Object.defineProperty(d.prototype,"isDataStored",{get:function(){return this._isDataStored},enumerable:true,configurable:true});Object.defineProperty(d.prototype,"lastVisit",{get:function(){return this._obj.lastVisit},enumerable:true,configurable:true});d.prototype.getNumComments=function(){return this._obj.numberOfComments};d.prototype.setLastVisit=function(){this._obj.lastVisit=Date.now();this.save()};d.prototype.setLastSeenPage=function(e){this._obj.lastSeenPage=e;this.save()};d.prototype.setLastCommentID=function(g,f,e){this._obj.lastCommentIDPages[g]=f;this._obj.numberOfComments=e;this.save()};d.prototype.isNewComment=function(f,e){if(f in this._obj.lastCommentIDPages){return(e>this._obj.lastCommentIDPages[f])}else{return true}};d.prototype.save=function(){localStorage[this.localStorageKey]=JSON.stringify(this._obj)};return d})();var b=(function(){function d(){this.style=".endless_new .comment__parent .comment__summary, .endless_new > .comment__child{}.endless_not_new .comment__parent .comment__summary, .endless_not_new > .comment__child{}.endless_not_new:hover .comment__parent .comment__summary, .endless_not_new:hover > .comment__child{}.endless_badge_new {border-radius: 4px; margin-left:5px; padding: 3px 5px; background-color: #C50000;text-shadow: none;color: white; font-weight: bold;}"}d.prototype.getDiscussionId=function(f){var e=/(discussion|trade)\/([^/]+)(\/|$)/.exec(f);if(!e){throw"No Discussion ID"}return e[1]+"_"+e[2]};d.prototype.getLatestCommentID=function(e){var f=0;$(e).find(".comment[data-comment-id]").each(function(g,h){var j=parseInt($(h).data("comment-id"));if(j>f){f=j}});return f};d.prototype.shouldRun=function(){return true};d.prototype.init=function(){};d.prototype.render=function(){if(SGPP.location.pageKind=="discussion"||SGPP.location.pageKind=="trade"){this.topicInfo=new c(this.getDiscussionId(location.pathname));var e=1;var f=$("div.pagination__navigation a.is-selected");if(f.length!=0){e=f.first().data("page-number")}this.markComments(document,e,true);this.topicInfo.setLastVisit()}else{if(SGPP.location.pageKind=="discussions"||SGPP.location.pageKind=="trades"){this.markTopics(document)}else{if(SGPP.location.pageKind=="giveaways"&&SGPP.location.subpage==""){this.markTopics($(".widget-container").last().prev().prev())}}}};d.prototype.checkNewComments=function(g,f){var h=this;var e=false;$(g).find(".comment[data-comment-id]").each(function(j,k){var l=parseInt($(k).data("comment-id"));if(h.topicInfo.isNewComment(f,l)){e=true}});return e};d.prototype.markComments=function(h,f,g){var i=this;if(g===void 0){g=false}$(h).find(".comment[data-comment-id]").each(function(j,k){var l=parseInt($(k).data("comment-id"));if(i.topicInfo.isNewComment(f,l)){$(k).addClass("endless_new");$(k).find(".comment__username").first().after($("<span>").addClass("endless_badge_new").text("New").attr("title","New since last visit"))}else{$(k).addClass("endless_not_new")}if(i.checkNewComments(k,f)){$(k).addClass("endless_new_children")}else{$(k).addClass("endless_no_new_children")}});if(g){var e=parseInt($(".comments:eq(1)").prev().find("a").text().split(" ")[0]);this.topicInfo.setLastCommentID(f,this.getLatestCommentID(h),e)}};d.prototype.markTopics=function(e){var f=this;$(e).find(".table__row-outer-wrap").each(function(k,l){try{var n=$(l).find("h3 a").first();var o=new c(f.getDiscussionId(n.attr("href")));if(true){n.attr("href",n.attr("href")+"/search?page=31337")}if(o.isDataStored){var h=parseInt($(l).find(".table__column--width-small a.table__column__secondary-link").text());var g=o.getNumComments();var j=h-g;if(j>0){$(l).addClass("endless_new_comments");if(true){n.after($("<span>").addClass("endless_badge_new").text(j).attr("title",j+" new comments since last visit"))}else{$(l).find(".table__column--width-fill > p").first().append(" - <strong>"+j+" new comments</strong>")}}else{$(l).addClass("endless_no_new_comments");$(l).find(".table__column--width-fill > p").first().append(" - no new comments</strong>")}}}catch(m){}})};d.prototype.name=function(){return"MarkComments"};return d})();a.MarkComments=b})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(a){var b=(function(){function c(){this._maxPage=31337;this._nextPage=-1;this._currentPage=1;this._lastPage=1;this._numberOfPages=-1;this._stopped=false;this._pages={};this._pagesUrl={}}Object.defineProperty(c.prototype,"stopped",{get:function(){return this._stopped},set:function(d){this._stopped=d},enumerable:true,configurable:true});Object.defineProperty(c.prototype,"currentPage",{get:function(){return this._currentPage},enumerable:true,configurable:true});Object.defineProperty(c.prototype,"lastPage",{get:function(){return this._numberOfPages},enumerable:true,configurable:true});Object.defineProperty(c.prototype,"reverseItems",{get:function(){return false},enumerable:true,configurable:true});Object.defineProperty(c.prototype,"BaseUrl",{get:function(){throw"BaseUrl() not implmented"},enumerable:true,configurable:true});c.prototype.hasPages=function(d){return $(d).find(".pagination__navigation").length!=0};c.prototype.getNavigationElement=function(d){return $(d).find(".pagination").first()};c.prototype.createPageContainerElement=function(){throw"createPageContainerElement() not implemented"};c.prototype.getItemsElement=function(d){throw"getItemsElement() not implemented"};c.prototype.getItems=function(d){throw"getItems() not implemented"};c.prototype.createLoadingElement=function(){var d=$('<span class="endless_loading"> - <i class="fa fa-refresh fa-spin"></i> Loading...</span>');return d};c.prototype.createPageElement=function(g){var i=this;var f=$('<div class="table__heading"><div class="table__column--width-fill"><p><span class="endless_page"></span></p></div></div>');var e=f.find("p");this.updatePageElement(f,g);var d=$("<div>").addClass("pull-right").addClass("endless_control_element");var h=$("<a>").attr("href","#").append('<i class="fa fa-pause"></i>').attr("title","Pause/Resume endless scrolling");h.click(function(){i.stopped=!i.stopped;$(".endless_control_element a i.fa").toggleClass("fa-pause").toggleClass("fa-play");return false});d.append(h);e.append(d);return f};c.prototype.updatePageElement=function(d,e){var f="";if(e>0){if(this._numberOfPages>0){f="Page "+e+" of "+this._numberOfPages}else{f="Page "+e}}else{f="Last page ends here"}d.find(".endless_page").text(f)};c.prototype.loadNextPage=function(){if(this._stopped){return}if(this._nextPage>this._lastPage||this._nextPage<1){return}this.loadPage(this._nextPage)};c.prototype.updateNextPage=function(d){if(this.reverseItems){this._nextPage=d-1}else{this._nextPage=d+1}};c.prototype.loadPage=function(j){var g=this;if(!(j in this._pagesUrl)){throw"No URL for page "+this._currentPage}if(!(j in this._pages)){var k=-1;var h=-1;$.each(this._pages,function(n,o){var p=Math.abs(n-j);if(h==-1||k>p){h=n;k=p}});var e=this.createPageContainerElement();var l=this.createLoadingElement();var m=this.createPageElement(j);m.find("p").first().append(l);e.append(m);this._pages[j]={element:e,loaded:false,loading:false,visible:true};var i=this._pages[h].element;if((h<j&&!this.reverseItems)||(h>j&&this.reverseItems)){i.after(e)}else{i.before(e)}}var f=this._pages[j];if(f.loading){return}else{if(f.loaded){if(!f.visible){f.element.show();f.visible=true}if(this._nextPage==j){this.updateNextPage(j)}}else{var d=this._pagesUrl[j];this._pages[j].loading=true;$.get(d,function(n){var q=$.parseHTML(n);g.beforeAddItems(q,j);var r=g.getItemsElement(q);var p=g.getNavigationElement(q);var o=parseInt(p.find("a.is-selected").data("page-number"));g.parseNavigation(p);g.addItems(r,e,j);e.prepend(m);g.getNavigationElement(document).html(p.html());g.afterAddItems(e,j);g._pages[j].loaded=true;l.remove();if(g._nextPage==j||g._nextPage==-1){g.updateNextPage(o)}if(o!=j){g.updatePageElement(m,o);g._pages[o]=g._pages[j];delete g._pages[j]}})}}};c.prototype.beforeAddItems=function(e,d){};c.prototype.addItems=function(f,d,e){var g=this;this.getItems(f).each(function(h,j){if(g.reverseItems){d.prepend(j)}else{d.append(j)}})};c.prototype.afterAddItems=function(d,e){};c.prototype.parseNavigation=function(e){var f=this;var d=e.find("a").last();this._lastPage=parseInt(d.data("page-number"));if(d.text().trim()!="Next"){this._numberOfPages=this._lastPage}e.find(".pagination__navigation a").each(function(h,j){var g=$(j);var k=parseInt(g.data("page-number"));f._pagesUrl[k]=g.attr("href");if(k>f._lastPage){f._lastPage=k}})};c.prototype.preparePage=function(){var i=this;var h=this.getNavigationElement(document);if(h.hasClass("pagination--no-results")){return}if(!this.hasPages(document)){this._currentPage=1;this._lastPage=1;this._numberOfPages=1}else{this._currentPage=parseInt(h.find("a.is-selected").data("page-number"));this.parseNavigation(h)}var e=this.getItemsElement(document);var f=this.createPageElement(this.currentPage);var d=SGPP.location.hash!="";this._pages[this.currentPage]={element:e,loaded:true,loading:false,visible:true};if(this.reverseItems){this.getItems(e).each(function(j,k){e.prepend(k)});if(this._currentPage==1&&this._numberOfPages>1&&!d){this._nextPage=this._lastPage;this.loadNextPage();this._pages[this.currentPage].visible=false;e.hide()}else{if(this._currentPage==1&&this._numberOfPages==-1&&!d){this._pagesUrl[this._maxPage]=this.BaseUrl+"/search?page="+this._maxPage;this._pages[this.currentPage].visible=false;e.hide();this.loadPage(this._maxPage)}else{this._nextPage=this._lastPage-1}}}else{this._nextPage=this._currentPage+1}e.prepend(f);if(d){var g=$("#"+SGPP.location.hash);$(window).scrollTop(g.offset().top)}$(window).scroll(function(j){var k=$(window).scrollTop()+$(window).height();if(k>$("div.pagination").position().top-200){i.loadNextPage()}});$(window).scroll()};return c})();a.EndlessScroll=b})(ModuleDefinition||(ModuleDefinition={}));var __extends=this.__extends||function(f,a){for(var e in a){if(a.hasOwnProperty(e)){f[e]=a[e]}}function c(){this.constructor=f}c.prototype=a.prototype;f.prototype=new c()};var ModuleDefinition;(function(b){var a=(function(d){__extends(c,d);function c(){d.apply(this,arguments);this.style=""}c.prototype.shouldRun=function(){return SGPP.location.pageKind=="discussions"||SGPP.location.pageKind=="trades"};c.prototype.init=function(){};c.prototype.render=function(){this.preparePage()};c.prototype.createPageContainerElement=function(){return $('<div class="table__rows">')};c.prototype.getItemsElement=function(e){return $(e).find(".table__rows").first()};c.prototype.getItems=function(e){return e.children(".table__row-outer-wrap")};c.prototype.beforeAddItems=function(e){if("MarkComments" in SGPP.modules){var f=SGPP.modules.MarkComments;f.markTopics(e)}};c.prototype.name=function(){return"EndlessScrollDiscussion"};return c})(b.EndlessScroll);b.EndlessScrollDiscussion=a})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(a){var b=(function(c){__extends(d,c);function d(){c.apply(this,arguments);this.style=""}d.prototype.shouldRun=function(){return SGPP.location.pageKind=="discussion"||SGPP.location.pageKind=="trade"};d.prototype.init=function(){};d.prototype.render=function(){if(true){var e=$(".comment--submit").first();if(e.length==1){var f=$('<div id="esc_reply_header" class="page__heading"><div class="page__heading__breadcrumbs">Reply</div></div>');if($(".poll").length==0){$(".comments").first().after(f)}else{$(".poll").first().after(f)}$("#esc_reply_header").after(e);$(".js__comment-reply-cancel").on("click",function(){setTimeout(function(){e.insertAfter("#esc_reply_header")},10)})}}this.preparePage()};Object.defineProperty(d.prototype,"BaseUrl",{get:function(){return"/"+SGPP.location.pageKind+"/"+SGPP.location.code+"/"+SGPP.location.description},enumerable:true,configurable:true});Object.defineProperty(d.prototype,"reverseItems",{get:function(){return true},enumerable:true,configurable:true});d.prototype.createPageContainerElement=function(){return $('<div class="comments">')};d.prototype.getItemsElement=function(e){return $(e).find(".comments:eq(1)")};d.prototype.getItems=function(e){return e.children(".comment")};d.prototype.beforeAddItems=function(f,e){if("MarkComments" in SGPP.modules){var g=SGPP.modules.MarkComments;g.markComments(f,e,true)}};d.prototype.name=function(){return"EndlessScrollDiscussionReplies"};return d})(a.EndlessScroll);a.EndlessScrollDiscussionReplies=b})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(b){var a=(function(d){__extends(c,d);function c(){d.apply(this,arguments);this.style=""}c.prototype.shouldRun=function(){return SGPP.location.pageKind=="giveaway"&&SGPP.location.subpage==""};c.prototype.init=function(){};c.prototype.render=function(){if(true){var e=$(".comment--submit").first();var f=$('<div id="esc_reply_header" class="page__heading"><div class="page__heading__breadcrumbs">Reply</div></div>');$(".comments").prev().before(f);$("#esc_reply_header").after(e);$(".js__comment-reply-cancel").on("click",function(){setTimeout(function(){e.insertAfter("#esc_reply_header")},10)})}this.preparePage()};c.prototype.createPageContainerElement=function(){return $('<div class="comments">')};c.prototype.getItemsElement=function(e){return $(e).find(".comments").first()};c.prototype.getItems=function(e){return e.children(".comment")};c.prototype.name=function(){return"EndlessScrollGiveawayComments"};return c})(b.EndlessScroll);b.EndlessScrollGiveawayComments=a})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(b){var a=(function(d){__extends(c,d);function c(){d.apply(this,arguments);this._location="frontpage";this.style=""}c.prototype.shouldRun=function(){if(SGPP.location.pageKind=="giveaways"){return !(SGPP.location.subpage=="entered"||SGPP.location.subpage=="created"||SGPP.location.subpage=="won")}else{if(/^\/user\/[^\/]+(\/giveaways\/won([^\/]+)?)?$/.test(location.pathname)){this._location="profile";return true}}return false};c.prototype.init=function(){};c.prototype.render=function(){this.preparePage()};c.prototype.createPageContainerElement=function(){return $("<div>")};c.prototype.getItemsElement=function(e){return $(e).find(".pagination").prev()};c.prototype.getItems=function(e){return e.children(".giveaway__row-outer-wrap")};c.prototype.afterAddItems=function(e){e.find(".giveaway__hide").click(function(){$(".popup--hide-games input[name=game_id]").val($(this).attr("data-game-id"));$(".popup--hide-games .popup__heading__bold").text($(this).closest("h2").find(".giveaway__heading__name").text())});e.find(".trigger-popup").click(function(){var f=$("."+$(this).attr("data-popup"));f.bPopup({opacity:0.85,fadeSpeed:200,followSpeed:500,modalColor:"#3c424d"})})};c.prototype.name=function(){return"EndlessScrollGiveaways"};return c})(b.EndlessScroll);b.EndlessScrollGiveaways=a})(ModuleDefinition||(ModuleDefinition={}));var ModuleDefinition;(function(b){var a=(function(d){__extends(c,d);function c(){d.apply(this,arguments);this.style=""}c.prototype.shouldRun=function(){if(SGPP.location.pageKind=="giveaways"){return SGPP.location.subpage=="entered"||SGPP.location.subpage=="created"||SGPP.location.subpage=="won"}else{if(SGPP.location.pageKind=="bundle-games"){return true}else{if(SGPP.location.pageKind=="giveaway"){return SGPP.location.subpage=="entries"||SGPP.location.subpage=="winners"||SGPP.location.subpage=="groups"}}}return false};c.prototype.init=function(){};c.prototype.render=function(){this.preparePage()};c.prototype.createPageContainerElement=function(){return $('<div class="table__rows">')};c.prototype.getItemsElement=function(e){return $(e).find(".table__rows").first()};c.prototype.getItems=function(e){return e.children(".table__row-outer-wrap")};c.prototype.afterAddItems=function(e){$(e).find(".table__remove-default").click(function(){var f=$(this);f.addClass("is-hidden");f.siblings(".table__remove-loading").removeClass("is-hidden");$.ajax({url:"/ajax.php",type:"POST",dataType:"json",data:f.closest("form").serialize(),success:function(g){f.siblings(".table__remove-loading").addClass("is-hidden");f.siblings(".table__remove-complete").removeClass("is-hidden");f.closest(".table__row-inner-wrap").addClass("is-faded");if(typeof g.points!=="undefined"&&g.points!==false){$(".nav__points").text(g.points)}}})})};c.prototype.name=function(){return"EndlessScrollMyGiveaways"};return c})(b.EndlessScroll);b.EndlessScrollMyGiveaways=a})(ModuleDefinition||(ModuleDefinition={}));var SGPP=new ModuleDefinition.Core();var modulesNames=new Array("CommentAndEnter","EntryCommenters","FixedNavbar","FixedFooter","GridView","ScrollingSidebar","MarkComments","EndlessScrollDiscussion","EndlessScrollDiscussionReplies","EndlessScrollGiveaways","EndlessScrollMyGiveaways","EndlessScrollGiveawayComments");var defaultModules=new Array("FixedNavbar","ScrollingSidebar");(function(c){for(var d in defaultModules){if(!SGPP.storage.containsItem(defaultModules[d])){SGPP.storage.setItem(defaultModules[d],"1")}}for(var d in modulesNames){var a=new ModuleDefinition[modulesNames[d]]();if(SGPP.settings.isModuleEnabled(modulesNames[d])&&a.shouldRun(SGPP.location)){SGPP.modules[a.name()]=a}}for(var b in SGPP.modules){SGPP.log("Module "+SGPP.modules[b].name()+" append css.");SGPP.appendCSS(SGPP.modules[b].style);SGPP.log("Module "+SGPP.modules[b].name()+" init() call.");SGPP.modules[b].init()}c(document).on("DOMContentLoaded",function(){SGPP.render();for(var e in SGPP.modules){SGPP.log("Module "+e+" render() call.");SGPP.modules[e].render()}})})(jQuery);