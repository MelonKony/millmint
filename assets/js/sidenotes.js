/**
 * @author: Kaushik Gopal
 *
 * A jQuery function that displays the footnotes
 * on the side (sidenotes) for easier reading.
 *
 * This is as recommended by Edward Tufte's style sidenotes:
 * https://edwardtufte.github.io/tufte-css/#sidenotes
 *
 * TODO:
 *      - if two subsequent lines have long sidenotes
 *        need to take care of the overlap properly and offset
 **/
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
    
    /*$(document).ready(function(){
      $("details").click(function(){
        loadSideNotesFromFootnotes();
      });
    });*/
    $('img').on('load', function() {
        loadSideNotesFromFootnotes();
    });
    $(document).ready(function(){
      $(window).scroll(function(){
        loadSideNotesFromFootnotes();
      });
    });

    function loadSideNotesFromFootnotes() {

        const $postTitle = $(".content"),
            browserWidth = $("body").width(),
            startPosition = $postTitle.position().left + $postTitle.outerWidth() + sideNoteStartMargin;

        $(".sidenote").remove(); // remove any existing side notes to begin
        $footnotes.show();  // previous resize could have hidden footnotes

        //#region Should we even show sidenotes?

        //#region there's no post-content
        if ($postTitle.length < 1) {
            return;
        }
        //#endregion

        //#region there's no space for sidenotes
        const availabeSpaceForSideNote = browserWidth - startPosition;

        // console.log(" ---> availabeSpaceForSideNote " + availabeSpaceForSideNote);
        // console.log(" ---> sideNoteWidth [" + sideNoteMinWidth + " - " + sideNoteMaxWidth + "]");

        if (availabeSpaceForSideNote < sideNoteMinWidth) {
            return;
        }
        //#endregion

        //#endregion

        const $fnItems = $footnotes.find("ol li");

        $("sup a").each(function (index) {
            const $footnoteText = $fnItems.eq(index).text().trim();
            createSideNote($(this), $footnoteText, startPosition);
        });

        $footnotes.hide();
    }

    function createSideNote(superscript, footnoteText, startPosition) {

        // console.log(" ---> " + superscript.text() + " : " + footnoteText);

        // construct side note <div>
        let div = $(document.createElement('div'))
            .text(footnoteText)
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
