/**
 * This is version Alpha 0.5
 * This code was created by Ben_R_R (Ben_R_R#2574)
 * .:. created by Ben_R_R .:. tolkienfan72@gmail.com .:.
 * Alpha 0.5 Changes: The animation engine now checks to see if the imagesloaded jquery plugin is installed, if it is, it uses that to
 * try and trigger the first frame as early as possible. https://imagesloaded.desandro.com/
 *
 * In order to make this work, I had to move that code into Register_Animation(), which is fine, because until we call Register_Animation we don't even
 * know if there is going to be an animationLoop() to render.
 *
 * BUG: There is currently a bug where if you have two animations on a page, you will end up calling animationLoop() twice per frame.
 * FIX: Add a flag to recognize when we have called animationLoop() from Register_Animation(), and don't call it again.
 *
 * Alpha 0.4 Changes: Changed $(document).ready() to $(window).load()
 * See here for an explanation: https://web.archive.org/web/20191115222535/http://net-informations.com/jq/iq/onload.htm
 * Made missing images a bit more robust.
 * Added an checking to make sure that the target canvas actually exists. This check is done when you call Register_Animation()
 *
 *
 * Alpha 0.3 Changes: Exposed a function that you can call to trigger a manual animationLoop() .
 *
 */
// Stuff we want added to the Global Namespace
// Should be noted that these variables in particular
// have to be watched for nameing conflicts with other scripts.
var Animation = null;
var Animated_Object = null;
var KeyFrame = null;
var Register_Animation = null;

var Update_Animation = null;

var _debug_last_error = null;

(function() { // WOO! Exploiting Javascript Lexical Closures to keep code from Polluting the Global Namespace!
// Remember kids: Other languages' hacked garbage is Javascript best practice!

    // Returns an interpolated y based on two points and an x value
    function linear_interpolation(x0, y0, x1, y1, x){ return (y0 * (x1-x) + y1 * (x - x0)) / (x1 - x0);}

    // Set the transformation matrix to the identity matrix
    function resetTransform(ctx){ ctx.setTransform(1, 0, 0, 1, 0, 0);}

    Animation = function (targetID, animated_objects, w, h, origin_x = 0.5, origin_y = 0.5,clear_color="#FFFFFF") {
        this.canvas = document.getElementById(targetID);
        this.ctx = this.canvas.getContext('2d');
        this.w = w; // animation bounding box width
        this.h = h; // animation bounding box height
        this.origin_x = origin_x; // decimal percentage, should usualy be between 0.0 and 1.0 (But can theoretical be anything)
        this.origin_y = origin_y; //
        this.animated_objects = animated_objects;
        this.clear_color = clear_color;
        this.targetID = targetID;

        this.render = function(){

            var t = -1 * this.canvas.getBoundingClientRect().top;

            // Test to see if the canvas is actualy on the screen right now.
            if(t < -window.innerHeight){ return; }

            if(t > this.canvas.getBoundingClientRect().height){ return; }

            // clear the canvas
            this.ctx.fillStyle = this.clear_color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Position the animation on the canvas based on the paramters we are given.
            this.ctx.translate(-(this.w * this.origin_x) + (this.canvas.width * this.origin_x),-(this.h * this.origin_y) + (this.canvas.height * this.origin_y));

            for(var i = 0; i < this.animated_objects.length; i++){
                this.animated_objects[i].render(this.ctx, t);
            }

            // reset the canvas--- in case something else wants to draw on it
            resetTransform(this.ctx);
        };

        // audit the render -- See what it wants to render at the given time
        this.render_audit = function(){
            out_obj = {}
            out_obj.t = -1 * this.canvas.getBoundingClientRect().top;
            out_obj.frames = [];

            for(var i = 0; i < this.animated_objects.length; i++){
                out_obj.frames.push( this.animated_objects[i].render_audit(out_obj.t));
            }

            return out_obj;
        }
    };

    /* pre_ani and post_ani can be 'lerp', 'stop', or 'hide' */
    Animated_Object = function(imageID, keyframes, pre_ani = 'lerp', post_ani = 'lerp'){
        this.image = document.getElementById(imageID);
        this.keyframes = keyframes;
        this.interp = linear_interpolation; // Nothing fancy for frame interpolation
        this.silent_render = false;
        this.pre_ani = pre_ani;   // What you do before the animation
        this.post_ani = post_ani; // What you do after the animation
        this.render = function(ctx, t) {

            if (this.keyframes.length === 0){
                return;
            }

            if (t < keyframes[0].t){
                if (this.pre_ani === 'stop' || keyframes.length === 1){
                    this.sub_render(ctx, this.keyframes[0].x, this.keyframes[0].y );
                    return;
                }
                if (this.pre_ani == 'lerp'){

                    var x = this.interp(keyframes[0].t, keyframes[0].x, keyframes[1].t, keyframes[1].x, t);
                    var y = this.interp(keyframes[0].t, keyframes[0].y, keyframes[1].t, keyframes[1].y, t);
                    this.sub_render(ctx, x, y);
                    return;
                }
                return; // pre_ani == anything else... Wonder if we should do that.
            }

            for(var i = 0; i < this.keyframes.length - 1; i++){
                if (t >= keyframes[i].t && t <= keyframes[i+1].t){
                    var x = this.interp(keyframes[i].t, keyframes[i].x, keyframes[i+1].t, keyframes[i+1].x, t);
                    var y = this.interp(keyframes[i].t, keyframes[i].y, keyframes[i+1].t, keyframes[i+1].y, t);
                    this.sub_render(ctx, x, y);
                    return;
                }
            }
            // if we get to this point, t is bigger than the last t:

            if (this.post_ani === 'stop' || keyframes.length === 1){
                this.sub_render(ctx, this.keyframes[this.keyframes.length-1].x, this.keyframes[this.keyframes.length-1].y );
                return;
            }
            if (this.post_ani == 'lerp'){
                var i = this.keyframes.length-1;
                var x = this.interp(keyframes[i-1].t, keyframes[i-1].x, keyframes[i].t, keyframes[i].x, t);
                var y = this.interp(keyframes[i-1].t, keyframes[i-1].y, keyframes[i].t, keyframes[i].y, t);
                this.sub_render(ctx, x, y);
                return;
            }
            return; // post_ani == anything else... Wonder if we should do that...

        };

        this.sub_render = function(ctx,x,y){
            try {
                ctx.drawImage(this.image, x, y);
            } catch (error) {
                _debug_last_error = error; // So if for some reason an image breaks, this will be called every frame, so rather than dump to console, save it in a variable to be accessed later
            }

        };

        // make a fake context and run in through the actualy render function,
        // then track what it actualy tries to render.
        this.render_audit = function(t){
            var rendered_object = null;
            var fake_ctx = {
                drawImage: function(img, x, y){rendered_object = {img:img,x:x,y:y};}
            }
            this.render(fake_ctx, t);
            return rendered_object;
        }
    };

    KeyFrame = function(t, x, y){
        return {x:x, y:y, t:t};
    };

    var window_has_moved = true;
    var callCanvasFix = true;

    var animations = [];

    // List of all canvases that we are rendering to. When you create a new animated object this list is updated
    var canvas_list=[]

    /**
     * Call this function to register an animation.
     * Note: The canvas (animation.targetID) must exist when this function is called.
     *
     */
    Register_Animation = function(animation){

        // Make sure that their is actually a target to render too.
        if($("#" + animation.targetID).length > 0){

            canvas_list.push(animation.targetID); // make sure things like the canvas fix function know about us
            animations.push(animation);
        } else {
            // throw an error to help catch the root issue
            throw "Canvas Does not Exist: #" + animation.targetID;
        }

        //
        if ($().imagesLoaded){ // if the imagesloaded plugin is available
            console.log("Using imagesloaded plugin");
            var img_load_promises = [];
            for(i=0; i<animation.animated_objects.length; i ++){
                img_load_promises.push($(animation.animated_objects[i].image).imagesLoaded());
            }
            // join promises so that animationLoop() will be called when they are all resolved.
            $.when.apply(null, img_load_promises).done(animationLoop);

        } else {
            console.log("Using $(window).load()");
            $(window).load(animationLoop);
        }
    }

    Update_Animation = function(){
        window_has_moved = true;
    }


    // This setup we can do when the DOM is ready, no need to wait for the images to load
    $(document).ready(function(){
        $( window ).scroll(function() {
            // Never animate on scroll. this function will be called a hundred
            // times or more on a scroll event, way faster than our render engine
            // could run.
            window_has_moved = true;
        });

        $( window ).resize(function() { // Note this also catches browser zoom level changes
            callCanvasFix = true;
        });
    });


    function fixCanvasLayout(){
        // This is where we handle things like browser zoom levels and the like.

        for(i=0;i<canvas_list.length;i++){
            //weird thing about canvas pixels, they stretch when their canvas does...
            // This unstretches them so they stay 'square' no mater what the canvas w/h ratio.
            $("#" + canvas_list[i]).attr("width", document.getElementById(canvas_list[i]).clientWidth );
            $("#" + canvas_list[i]).attr("height", document.getElementById(canvas_list[i]).clientHeight);
        }

        callCanvasFix = false;
    }

    function animationLoop(delta_t){

        if (callCanvasFix){
            fixCanvasLayout();
            window_has_moved = true // redraw the animation if we have to fix the canvases
        }

        if(window_has_moved === false){ // Quick exit if we don't need to animate anything
            window.requestAnimationFrame(animationLoop);
            return;
        }
        window_has_moved = false;

        for(var i = 0; i < animations.length; i++){
            animations[i].render();
        }

        window.requestAnimationFrame(animationLoop);
    }



})();// Fun Magic!
