/*
 *This page assigns arrayID dataset attributes to all of the images in the gallery page, giving them easily accesible markers for their location in various arrays.
 *
 *When an image is clicked, a few things happen. It looks to see which images have been given the hideImage class by the filtering scripts, and then creates a new array of images MINUS the hidden images. It then gives those
 *images a NEW dataset attribute ArrayID. This allows for scrolling within filtered image sets.
 *The script then assigns the arrayID of the image you just clicked (which has just been given a new arrayID) to the lightbox modal. A matching title from the artArray.js page is then assigned to the painting.
 *It is important that the modal be given the arrayID of the current image. This allows it to know where it is in the array, so that it is able to utilize the left and right scrolling options. Otherwise it tries to start at the
 *start of the array each time.
 *
 *When scrolling between images in the lightbox, a variable -1 or +1 is passed from the onclick event into the function. It adds or subtracts from the current lighbox model arrayID and then puts THAT number into the array of
 *images that were not hidden (imagesForGallerySlides[i]) and takes THAT image's .src to become the lightboxes new .src. The new modal ArrayID is also passed back into the visible images array where the dataname attribute is taken
 *from the current image, and used to retrieve the correct description from the artArray.js page.
*/

/*---------------------------------Gallery Popup -----------------------------------*/
var gallery = document.getElementById("gallery"); // Select only stuff from within the modal image holder part of the page (avoids logo activating the lightbox)
var image = gallery.getElementsByTagName("img"); //put all images in image variable

var popup = document.getElementById("popup"); //select modal div
var lightboxImage = document.getElementById("modalPopup"); //select image that goes into the modal popup
var imageText = document.getElementById("modalText");
var popupX = document.getElementById("popupX");
//global variables for passing stuff between onclick popup event and lightbox scrolling
imagesForGallerySlides = '';

for (var i = 0; i < image.length; i++)  //put image array into variable img + create onclick action
{
    var img = image[i];
    img.dataset.arrayid = i; //sets arrayid data attribute for all images [IMPORTANT FOR RESETTING DATA ID WHEN FILTERING!!!]
    img.onclick = doOnClick;
}

function doOnClick(){   //do all the onclick stuff
    //avoid hidden images in gallery slides by filtering with this section
    var hiddenImages = gallery.getElementsByClassName("hideImage"); //gets all hidden images into a node list
    var imageRealArray = Array.from(image); // nodelist => array
    var hiddenImagesArray = Array.from(hiddenImages); //nodelist =>array
    //takes the full image array then looks(filters) for images that are not in the hidden images array -- output is only the visible images
    imagesForGallerySlides = imageRealArray.filter(values => !hiddenImagesArray.includes(values)); 
    for (var i = 0; i < imagesForGallerySlides.length; i++){ //this loop resets the data arrayID attributes so only the non-hidden images have one
        var img = imagesForGallerySlides[i];
        img.dataset.arrayid = i;
    }
    
            /*-------------------Lightbox Popup---------------------*/
    popup.style.display = "block";
    lightboxImage.src = this.src;
    lightboxImage.dataset.arrayid = this.dataset.arrayid; //passes the dataset arrayID attribute to the popup modal so that it has a reference point when scrolling between images
    imageText.innerHTML = infoArray[this.dataset.name]; //gives painting info from array in artarray.js
    
    var textCheck = imageText.innerHTML;
    if(textCheck == "undefined" || undefined || null || false){imageText.innerHTML = "";} //if it doesn't match anything in the array, then show nothing
    
}

/*----------------------------------------- Lightbox Close ----------------------------------*/
window.onclick = function(evt){ //click anywhere when modal is popped to make it vanish again
    if (evt.target == popup) {
        popup.style.display = "none";
    }
}

popupX.onclick = function(){  //super high z index close X for iOS
    popup.style.display = "none";
}

/*--------------------------------------------Gallery Lightbox Image Scroll/Slideshow-----------------------------------*/
//left and right gallery buttons
var galleryLeft = document.getElementById("galleryLeft");
var galleryRight = document.getElementById("galleryRight");

galleryLeft.addEventListener("click", function() {galleryDirection(-1);});
galleryRight.addEventListener("click", function() {galleryDirection(1);});

function galleryDirection(direction){
    var newArrayId = Number(lightboxImage.dataset.arrayid) + Number(direction); //creates newArrayId variable with the current modal arrayid + the currently added direction input -1 or +1
    if(newArrayId < 0){newArrayId = imagesForGallerySlides.length - 1;} //if the result is -1 then the newArrayId var becomes the same as the last slide ID in the array of slides to be shown
    if(newArrayId > imagesForGallerySlides.length - 1){newArrayId = 0;} //if the result is greater than the number of slides to be shown, the array id becomes 0 and shows the first slide
    lightboxImage.src = imagesForGallerySlides[newArrayId].src; //the modal popup src is the current (newArrayId) src from the array of images to be shown
    lightboxImage.dataset.arrayid = newArrayId; //this sets the modal's arrayid dataset to be the same as the newArrayId number for scrolling purposes (needs to know where it is in the array to be assigned the next/prev img src)
    
    imageText.innerHTML = infoArray[(imagesForGallerySlides[newArrayId].dataset.name)]; //takes the current image in the lightbox and grabs the correct description 
}


/*-------------------Dropdown Filters--------------------------------*/
/*
 *The filter works by first creating arrays of elements that are in both dropdown menus. Then when one option is clicked on it is assigned to the top of the dropdown list and given the "CURRENT" dataset attribute tag.
 *The filter all section works by first removing the hideImage class from all gallery images. It then checks if the media dropdown box's current dataset is set to all, if so, it moves on, if not, it takes the
 *current dataset attribute value, and compares it to the media dataset on all of the images. Anything without a matching dataset (media !== current) is given the hideImage tag, and is hidden.
 *It then repeats this process for the date dropdown, creating the two tier filtering.
 *Additional filters can be added in the same way, as long as the corrent datasets are in place.
*/
var filterTypeOne = document.getElementsByClassName('backgroundLiFilter');
var filterTypeTwo = document.getElementsByClassName('circleLiFilter');
var filterTypeThree = document.getElementsByClassName('dateLiFilter');
var filterTypeOneText = document.getElementById('backgroundDropdownText');
var filterTypeTwoText = document.getElementById('circleDropdownText');
var filterTypeThreeText = document.getElementById('dateDropdownText');

for(i = 0; i < filterTypeOne.length; i++ ){ //background array
    var backgrounds = filterTypeOne[i];
    backgrounds.onclick = writeBackground;
}
for(i = 0; i < filterTypeTwo.length; i++ ){ //circle array
    var circle = filterTypeTwo[i];
    circle.onclick = writeCircle;
}
for(i = 0; i < filterTypeThree.length; i++ ){ //date array
    var date = filterTypeThree[i];
    date.onclick = writeDate;
}

function writeBackground(){ //currently selected medium
    filterTypeOneText.innerHTML = this.innerHTML;
    filterTypeOneText.dataset.current = this.dataset.filterbackground; //sets dataset current
    filterAll();
}
function writeCircle(){ //currently selected date
    filterTypeTwoText.innerHTML = this.innerHTML;
    filterTypeTwoText.dataset.current = this.dataset.filtercircle; //sets dataset current
    filterAll();
}
function writeDate(){ //currently selected date
    filterTypeThreeText.innerHTML = this.innerHTML;
    filterTypeThreeText.dataset.current = this.dataset.filterdate; //sets dataset current
    filterAll();
}

function filterAll(){
    for(i = 0; i < image.length; i++ ){
        var allImages = image[i]; //all images in gallery
        allImages.classList.remove("hideImage"); //removes hide class tag from everything
        if(filterTypeOneText.dataset.current !== 'showAll'){if(allImages.dataset.background !== filterTypeOneText.dataset.current){allImages.classList.add("hideImage")};}; //checks for all tag, if not, check current tag type, if not a match, hide
        if(filterTypeTwoText.dataset.current !== 'showAll'){if(allImages.dataset.circle !== filterTypeTwoText.dataset.current){allImages.classList.add("hideImage")};}; //checks for all tag, if not, check current tag type, if not a match, hide
        if(filterTypeThreeText.dataset.current !== 'showAll'){if(allImages.dataset.date !== filterTypeThreeText.dataset.current){allImages.classList.add("hideImage")};};
    };
}

/*------------------------------------ Title Array ----------------------------*/
var infoArray = { //all lowercase to match data-name
    blackBluecircle2017: '<p>Black Background, Blue Circle, 2017</p>',
    blackBluecircle2018: '<p>Black Background, Blue Circle, 2018</p>',
    blackGreencircle2017: '<p>Black Background, Green Circle, 2017</p>',
    blackGreencircle2018: '<p>Black Background, Green Circle, 2018</p>',
    blackRedcircle2017: '<p>Black Background, Red Circle, 2017</p>',
    blackRedcircle2018: '<p>Black Background, Red Circle, 2018</p>',
    blueBlackcircle2017: '<p>Blue Background, Black Circle, 2017</p>',
    blueBlackcircle2018: '<p>Blue Background, Black Circle, 2018</p>',
    blueWhitecircle2017: '<p>Blue Background, White Circle, 2017</p>',
    blueWhitecircle2018: '<p>Blue Background, White Circle, 2018</p>',
    greenBlackcircle2017: '<p>Green Background, Black Circle, 2017</p>',
    greenBlackcircle2018: '<p>Green Background, Black Circle, 2018</p>',
    greenWhitecircle2017: '<p>Green Background, White Circle, 2017</p>',
    greenWhitecircle2018: '<p>Green Background, White Circle, 2018</p>',
    redBlackcircle2017: '<p>Red Background, Black Circle, 2017</p>',
    redBlackcircle2018: '<p>Red Background, Black Circle, 2018</p>',
    redWhitecircle2017: '<p>Red Background, White Circle, 2017</p>',
    redWhitecircle2018: '<p>Red Background, White Circle, 2018</p>'
};