(function() {

  document.addEventListener('DOMNodeInserted', checksearch, false);
  function checksearch() {  
    if (window.location.hostname.match(/www\.facebook\.com/)) {     
      document.removeEventListener('DOMNodeInserted', checksearch, false);
      document.addEventListener('DOMNodeInserted', huntForLinks, false);
    }
  }
  
  function fixRedirect(event) {    
    var node = event.target;
    if(!node.getAttribute('onmouseover') ||  !node.getAttribute('onclick')) {
      node = this;
    }
    var mouseOverAttr = node.getAttribute('onmouseover');    
    node.removeAttribute('onclick');
    node.removeAttribute('onmouseover');
  
    node.removeEventListener('mouseover', fixRedirect, false);
    var refPattern = /LinkshimAsyncLink.swap\(this\, \"(.*)\"\);/;
    mouseOverAttr = mouseOverAttr.replace(/&quot;/g,'"');  
    var realHref = unescape(refPattern.exec(mouseOverAttr)[1]);  
    realHref = realHref.replace(/\\\//g, "/");    
    node.href = realHref;  
  };
  
  
  function huntForLinks() {  
    var items = document.getElementsByTagName('a');  
    var mouseOverAttr;
    var onClickAttr;
    var evilFunc1 = 'LinkshimAsyncLink.swap(this';
    var evilFunc2 = 'LinkshimAsyncLink.referrer_log(this';
    for (var i = items.length - 1; i >= 0; i--) {
      mouseOverAttr = items[i].getAttribute('onmouseover');
      onClickAttr = items[i].getAttribute('onclick');
      
      if (mouseOverAttr && onClickAttr) {      
        if (mouseOverAttr.indexOf(evilFunc1) !== -1 && onClickAttr.indexOf(evilFunc2) !== -1) {                 
          items[i].addEventListener('mouseover', fixRedirect, false);        
        }
      }
    }
    ;
  }

})();