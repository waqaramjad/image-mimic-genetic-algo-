let img;
let dps = [{x: 0, y: 0}];
let chart = 0; // nothing happen
let imgSize = 30;
let scaleValue = 5; // image width 
let targetImgPixelMat = [];
let initialHeapRange = [500, 1150]; // ?
let initialHeap = Math.round(initialHeapRange[0] + Math.random() * (initialHeapRange[1] - initialHeapRange[0]));
console.log(initialHeap) // 785
let threshold = 4; // only work best on 4 while if i increase it range it becomes small image 
let gapBetweenImages = 5; // image gap 
let canvasPadding = 10;
let populationLength = 10000; // if low no move very fast but if large no move very fast 
let selectionCount = 1; // ??
let chromosomesLength = imgSize * imgSize; //900
let chromosomeRange = [0, threshold - 1]; // related to threshhold 
let mutationRate  = 0.01;
let lastFitness  = 0;
let ENVIRONMENT  = new Environment(populationLength, selectionCount, chromosomesLength, chromosomeRange, mutationRate);
// console.log('chromosomeRange',chromosomeRange,'chromosomesLength',chromosomesLength , ENVIRONMENT , 'ENVIRONMENT')
console.log(   'ENVIRONMENT',ENVIRONMENT ) // RETURN SOME dumy value due to code dismis 

let newGene = ENVIRONMENT.getNewGene();
console.log( newGene , 'newGene')

newGene.chromosomes = targetImgPixelMat;
console.log(' newGene.chromosomes' , newGene.chromosomes)

ENVIRONMENT.targetGene = newGene;
console.log(ENVIRONMENT.targetGene)
let targetImageP5 = new p5(); // CANVAS OBJECT 
console.log(targetImageP5)


window.onload = ()=>{
    try{
        let  targetImageSketch = _ => {
            _.setup = () => {
                // creating canvas 
                let canvas = _.createCanvas((((imgSize + (gapBetweenImages / 2)) * scaleValue) * 2) + canvasPadding, imgSize * scaleValue + canvasPadding);
                console.log(canvas)

                canvas.parent("targetImage"); // target html parent 
                for (let i = 0; i < imgSize * imgSize; i++)
                    targetImgPixelMat.push(0);
                    console.log(targetImgPixelMat)
                let imid = Math.round(imgSize / 2); // use for pre generated image y axis 15

                let jmid = Math.round(imgSize / 2);// use for pre generated image x axis 15
console.log(imid , jmid , initialHeap)// 15 15 

                let imageGen = new ImageGenerator(imgSize, imgSize, threshold);
                imageGen.setImagePixel(imid, jmid, targetImgPixelMat, initialHeap);
                while (Math.max(...targetImgPixelMat) > imageGen.threshold) {
                    console.log(Math.max(...targetImgPixelMat) //give intial heap value 
                    , imageGen.threshold // normal threshold 
                    )
                    for (let i = 0; i < imgSize; i++)
                        for (let j = 0; j < imgSize; j++) {
                            if (imageGen.getImagePixel(i, j, targetImgPixelMat) >= imageGen.threshold)
                                imageGen.constructNewDesign(imid, jmid, targetImgPixelMat);
                        }
                }
                img = imageGen.constructImage(targetImgPixelMat, targetImageP5); // contruct image using canvas and made pre build image  
                ENVIRONMENT.randomPopulateAll(); // create polulation with 100000 genes for pre image 
                document.getElementById("preLoader").style.display = "none"; // already define 
                document.body.style.overflow = "scroll";   // for scroll
            };

            _.draw = () => {
                _.scale(scaleValue); // use to show high scale value
                // _.background(0);
                _.image(img, (canvasPadding / scaleValue) / 2, (canvasPadding / scaleValue) / 2);

                // _.frameRate(1);
                if (ENVIRONMENT.isActive()) {
                    ENVIRONMENT.sortPopulation();
                    let newImage = new ImageGenerator(imgSize, imgSize).constructImage(ENVIRONMENT.getBestChromosome(), targetImageP5); // make random dots of 230*230
                    _.image(newImage, ((canvasPadding / scaleValue) / 2) + imgSize + gapBetweenImages, (canvasPadding / scaleValue) / 2); // draw image 
                    let topFitness = ENVIRONMENT.population[0].fitness.toFixed(3);
                    if (parseFloat(document.getElementById("fitnessScore").innerText) > topFitness) {
                        alert("issue found!");
                    }
                    document.getElementById("fitnessScore").innerText = topFitness;
                    document.getElementById("fitnessScoreBar").style.width = `${topFitness}%`;
                    document.getElementById("growthRate").innerText = (topFitness - lastFitness).toFixed(3);
                    lastFitness = topFitness;
                    if (chart !== null && ENVIRONMENT._generation % 3 === 0) {
                        dps.push({
                            x: ENVIRONMENT._generation,
                            y: Math.round(topFitness)
                        });
                        chart.render();
                    }
                    if (topFitness >= 100) {
                        alert("100% completed...");
                        _.noLoop();
                    }
                    ENVIRONMENT.populateAll();
                }
            };
        };


        chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: "Generation Vs Fitness"
            },
            axisY: {
                includeZero: false
            },
            data: [{
                type: "line",
                dataPoints: dps
            }]
        });
        chart.render();

        targetImageP5 = new p5(targetImageSketch);
    }catch (e) {
        alert(e)
    }
};