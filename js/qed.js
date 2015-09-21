/*
 * Qed!
 * Quick Editor!
 * @author http://google.com/+BillRocha
 * @since 0.0.5
 *
 */
var tmp = '';
window.onload = function(){

    window.onkeydown = function(e){
        if(e.ctrlKey){
            switch(e.keyCode){
                case 49:    //select EDITOR
                    _('c1').children[1].focus();
                    _('c1').classList.add('focus');
                    _('c2').classList.remove('focus');
                    break;
                case 50:    //select PREVIEW
                    _('c2').children[1].focus();
                    _('c2').classList.add('focus');
                    _('c1').classList.remove('focus');
                    break;
                case 77:    //toggle MENU
                    _('menu').classList.toggle('focus');
                    _('menu').children[0].children[0];
                    break;
                case 51:    //Ctrl+3
                    window.open('http://github.com/pedra/quickdoc');
                    break;
                case 52:    //Ctrl+4
                    document.location = document.location;
                    break;
                case 53:    //Ctrl+5
                    window.open('http://github.com/pedra/quickdoc');
                    break;
                case 54:    //Ctrl+6
                    window.open('http://github.com/pedra/quickdoc');
                    break;
                case 55:    //Ctrl+7
                    window.open('http://github.com/pedra/quickdoc');
                    break;
                case 56:    //Ctrl+8
                    window.open('http://github.com/pedra/quickdoc');
                    break;
                case 57:    //Ctrl+9
                    window.open('http://github.com/pedra/quickdoc');
                    break;
            }
        }
    }

    window.onclick = function(e){
        switch(e.target.id){
            case 't1':  //select EDITOR
                _('c1').classList.add('focus');
                _('c2').classList.remove('focus');
                break;
            case 't2':  //select PREVIEW
                _('c2').classList.add('focus');
                _('c1').classList.remove('focus');
                break;
        }
    }

    //Format on keyUp...
    _('txt').onkeyup = function(e){//k = e; console.log('kup: '+e.which+' - '+String.fromCharCode(e.which)+' - '+e.keyCode)
        if(e.which == 8 || e.which == 46) _('preview').innerHTML = toHtml(_('txt').value)
    }

    //Format on keyPress
    _('txt').onkeypress = function(e){ //ky = e; console.log('kpress: '+e.which+' - '+String.fromCharCode(e.which)+' - '+e.keyCode)
        setTimeout(function(){_('preview').innerHTML = toHtml(_('txt').value)}, 50);
    }

    //Format on load page.
    _('preview').innerHTML = toHtml(_('txt').value);

    //menu
    _('menu').onclick = function(e){
        _('menu').classList.remove('focus');
    }
    _('reload').onclick = function(){document.location = document.location;}
}


function toHtml(t){

    //eliminando tags inseridas pelo usuário
    t = t.replace(/(<)/g, '&lt;').replace(/(>)/g, '&gt;');

    t = t.split(/\n(.+|\s+)/g); //tmp = t[3]; //console.log(t[3]);
    tm = t.length;
    var o = ''; //OUTPUT string

    //SCANNER .... BEGIN
    for(var i = 0; i < t.length; i++){

        if(t[i] == '') continue;

        //Eliminando "new lines"
        if(t[i].search(/\n\n/g) > -1) {
            t[i] = t[i].replace(/\n/g,"<br/>");
            o += t[i];
            continue;
        }

        //pegando TITULOS
        if(t[i].search(/#{1,3}(\s|.+)/g) == 0) {
            t[i] = t[i].replace(/###(\s|.+)/g, '<h4>$1</h4>');
            t[i] = t[i].replace(/##(\s|.+)/g, '<h3>$1</h3>');
            t[i] = t[i].replace(/#(\s|.+)/g, '<h2>$1</h2>');
        }

        //Bold, Itálic end Strike
        t[i] = t[i].replace(/\*(\s+|.[^*]+)\*/g, '<b>$1</b>');
        t[i] = t[i].replace(/_(\s+|.[^_]+)_/g, '<i>$1</i>');
        t[i] = t[i].replace(/s\|(\s+|.[^-]+)\|s/g, '<s>$1</s>');
        t[i] = t[i].replace(/""(.[^"]+)""/g, '<blockquote>$1</blockquote>');

        //Hipperlink lnk|site.com||name|lnk -- http or e-mail
        t[i] = t[i].replace(/lnk\|(.[^|]+@.[^|]+)\|lnk|lnk\|(.[^|]+@.[^|]+)\|\|(.[^|]+)\|lnk/g, '<a href="mailto:$1$2">$1$3</a>');
        t[i] = t[i].replace(/lnk\|(.[^|@]+)\|lnk|lnk\|(.[^|@]+)\|\|(.[^|]+)\|lnk/g, '<a href="$1$2">$1$3</a>');

        //image: img|link.jpg||Legenda|img
        t[i] = t[i].replace(/img\|(.[^|]+)\|img|img\|(.[^|]+)\|\|(.[^|]+)\|img/g, '<figure><img src="$1$2" alt="$3" title="$3"><legend>$3</legend></figure>');

        //localizando LISTAGENS - lst| xxx |lst
        if(t[i].search(/lst\|/g) > -1){
            for(var ix = i; ix < tm;ix++){
                if(t[ix].search(/\|lst/g) > -1){
                    break;
                }
            }
            if(ix < tm){//encontrou!
                t[i] = '<ul>';
                t[ix] = '</ul>';
                for(var i1 = (i+1); i1 < ix; i1++){
                    t[i1] = t[i1].replace(/(^[^<].+)/, '<li>$1</li>');
                }
            }
        }

        //Localizando TABELAS - tbl| xx xx |tbl
        if(t[i].search(/tbl\|/g) > -1){
            for(var ix = i; ix < tm;ix++){
                if(t[ix].search(/\|tbl/g) > -1){
                    break;
                }
            }
            if(ix < tm){//encontrou!
                t[i] = '<table><tr>';
                t[ix] = '</tr></table>';

                var tg = 'th';
                var ct = false; //ocorrencia de fechamento/abertura de TR

                for(var i1 = (i+1); i1 < ix; i1++){
                    if(t[i1].search(/\n/) > -1) {
                        t[i1] = '</tr><tr>';
                        ct = !ct;
                        tg = 'td';
                    } else {  //linha comum
                        if(t[i1] != "") t[i1] = '<'+tg+'>'+t[i1]+'</'+tg+'>';
                    }
                }
            }
        }

        //Parágrafo
        t[i] = t[i].replace(/(^[^<].+)/, '<p>$1</p>');

        o += t[i];
    } //SCANNER ..... END

    return o;
}

//utils . . .
function _(e){return document.getElementById(e)}

function _click(i){
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0
        , false, false, false, false, 0, null
    );
    i.dispatchEvent(e);
    i.focus();
}
