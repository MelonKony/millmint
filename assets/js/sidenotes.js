/* SIDENOTES.JS // @author: Kaushik Gopal @modified: Jip Frijlink // Adds sidenotes */

(function () {
    const $footnotes = $(".footnotes"),
        sideNoteStartMargin = 12,
        sideNoteMaxWidth = 280,
        sideNoteMinWidth = 140;

    $(window).on("load", function () {


        // don't run this script if there aren't any footnotes
        if ($footnotes.length < 1) {
            return;
        }

        loadSideNotesFromFootnotes();

        $(window).resize(function () {
            
            loadSideNotesFromFootnotes();
            
        });
    });
    
    $('img').on('load', function() {
        loadSideNotesFromFootnotes();
    });
    $(document).ready(function(){
      $(window).scroll(function(){
        loadSideNotesFromFootnotes();
      });
    });

    function loadSideNotesFromFootnotes() {

        const $postTitle = $(".content")
        const startPosition = $postTitle.position().left - sideNoteStartMargin - sideNoteMinWidth

        $(".sidenote").remove(); // remove any existing side notes to begin
        $footnotes.show();  // previous resize could have hidden footnotes

        //#region Should we even show sidenotes?

        //#region there's no post-content
        if ($postTitle.length < 1) {
            return;
        }
        //#endregion

        //#region there's no space for sidenotes
        if(window.innerWidth <= 1199) return;

        // console.log(" ---> availabeSpaceForSideNote " + availabeSpaceForSideNote);
        // console.log(" ---> sideNoteWidth [" + sideNoteMinWidth + " - " + sideNoteMaxWidth + "]");
        //#endregion

        //#endregion

        const $fnItems = $footnotes.find("ol li");

        $("sup a").each(function (index) {
            const $footnoteText = $fnItems.eq(index).html();
            console.log($footnoteText)
            createSideNote($(this), $footnoteText, startPosition);
        });

        $footnotes.hide();
    }

    function createSideNote(superscript, footnoteText, startPosition) {

        // console.log(" ---> " + superscript.text() + " : " + footnoteText);

        // construct side note <div>
        let div = $(document.createElement('aside'))
            .html(footnoteText.replace(/↩︎/g, ''))
            .addClass("sidenote");

        const topPosition = superscript.offset();

        div.css({
            position: "absolute",
            left: startPosition,
            top: topPosition["top"],
            minWidth: sideNoteMinWidth,
            maxWidth: sideNoteMaxWidth,
        });

        if (startPosition > 420) {
            superscript.hover(function () {
                div.addClass("sidenote-hover");
            }, function () {
                div.removeClass("sidenote-hover");
            });
        } else {
            div.addClass("sidenote-hover");
        }

        // console.log(" ---> ");

        // attach side note <div>
        $(document.body).append(div);
    }

})();
