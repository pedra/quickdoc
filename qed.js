/*
 * Qed!
 * Quick Editor!
 * @author http://google.com/+BillRocha
 * @since 0.0.5
 *
 */

window.onload = function(){

    //Format on key up...
    _('txt').onkeyup = function(e){reloadHTML()}

    //Initial HTML load.
    reloadHTML();
}

function reloadHTML() {_('preview').innerHTML = formTable(formate(_('txt').value));}

function formate(t){

    //retirando tags HTML
    t = t = t.replace(/(<)/g, '&lt;').replace(/(>)/g, '&gt;');

    //image ( [img] -> <img src=" "> )
    t = t.replace(/\[img\](.+)\|\|(.+)\n/ig, '<figure><img src="$1"><legend>$2</legend></figure>' )
    t = t.replace(/\[img\](.+)\n/ig, '<figure><img src="$1"></figure>' )

    //link ( [link] -> <a href="link">texto )
    t = t.replace(/\[link\](.+)\|\|(.+)\n/ig, '<a href="$1">$2</a>' )
    t = t.replace(/\[link\](.+)\n/ig, '<a href="$1">$1</a>' )

    //subtitulo ( # -> <h2> )
    t = t.replace(/##(.+)\n/g, '<h3>$1</h3>')

    //subtitulo ( ## -> <h3> )
    t = t.replace(/#(.+)\n/g, '<h2>$1</h2>')

    //Pular linha ( +.\n -> <br>)
    t = t.replace(/\+\+\+\n/g, '<br />')

    //paragrafo ( +x\n -> <p>x</p>)
    t = t.replace(/\+(.+)\n/g, '<p>$1</p>')

    //lista simples
    t = t.replace(/\*\*(.+)\n/g, '<li>$1</li>')

    //paragrafo ( ""x"" -> <blockquote>x</blockquote>)
    t = t.replace(/""(.+)\n/g, '<blockquote>$1</blockquote>')

    //subtitulo ( *x* -> <b>x</b> )
    t = t.replace(/\*\((.[^\)\*]+)\)\*/g,'<b>$1</b>'); //Funciona com "*(texto)*"
    //t = t.replace(/ \*(.[^\*]+)\*/g,' <b>$1</b>'); //Funciona com "...este *texto* aqui..."

    //subtitulo ( _x_ -> <i>x</i> )
    t = t.replace(/_\((.[^\)_]+)\)_/g,'<i>$1</i>'); //Funciona com "_(texto)_"
    //t = t.replace(/ _(.[^_]+)_/g,' <i>$1</i>'); //Funciona com "...este _texto_ aqui..."

    //subtitulo ( -x- -> <s>x</s> )
    t = t.replace(/\-\((.[^\)\-]+)\)\-/g,'<s>$1</s>'); //Funciona com "-(texto)-"
    //t = t.replace(/ \-(.[^\-]+)\-/g,' <s>$1</s>'); //Funciona com "...este -texto- aqui..."

    return t;
}

function formTable(txt){

    var inicio = txt.search(/table\(/g);
    var final = txt.search(/\)table/g);

    if(inicio == -1 || final == -1) return txt;

    var tb = txt.substring(inicio+7, final);
    if(tb.trim() == '') return txt;

    var l = tb.split(/\n\n/g);
    var linha = '<table>';
    var c = (l.length > 0) ? 0 : 1;
    for(var i in l){
        if(c == 0) linha += '<tr>'+l[i].replace(/(.+)/g, '<th>$1</th>')+'</tr>';
        else linha += '<tr>'+l[i].replace(/(.+)/g, '<td>$1</td>')+'</tr>';
        c++;
    }

    linha += '</table>';

    return  txt.substr(0, inicio) + linha + txt.substr(final+7);
}

//helper . . .
function _(e){return document.getElementById(e)}
