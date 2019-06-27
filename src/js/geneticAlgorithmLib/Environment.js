var a = 1
class Environment {
    constructor(populationLength, selectionCount, geneLength, chromosomeRange, mutationRate, chromosomeRangeDecimal = false) {
        // console.log(selectionCount) // 1
        this.populationLength = populationLength;
        this.population = [];
        this._generation = 0;
        this._active = true;
        this.selectionCount = selectionCount;
        this._targetGene = null;
        this.geneLength = geneLength;
        this.chromosomeRange = chromosomeRange;
        this.mutationRate = mutationRate;
        this.chromosomeRangeDecimal = chromosomeRangeDecimal;
    }

    isActive() {
        return this._active;
    }

    get targetGene() {
        return this._targetGene;
    }

    set targetGene(value) {
        this._targetGene = value;
    }

    getBestChromosome() {
        return this.population[0].genes;
    }

    getNewGene() {
        // alot of genes formed 
        // console.log(++a)
        return new GA_Gene(this.geneLength, this.chromosomeRange, this.mutationRate, this.chromosomeRangeDecimal);
    }

    randomPopulateAll() {
        this.population = [];
        // console.log(this.populationLength)
        for (let i = 0; i < this.populationLength; i++) {
            let gene = this.getNewGene();
            gene.applyRandomChromosome();
            gene.fitness = gene.applyMutation(undefined, this._targetGene);
            this.population.push(gene);
        }
        // console.log(this.population)  // a large population of 100000 genes 

    }

    sortPopulation() {
        this.population.sort((gene1, gene2) => {
            return (gene1.fitness < gene2.fitness) ? 1 : (gene1.fitness === gene2.fitness) ? 0 : -1;
        });
    }

    populateAll() {
        this._generation++;
        let topPerformers = this.population.slice(0, this.selectionCount);
        // console.log(topPerformers)
        let population = [];
        for (let i = this.selectionCount; i < this.populationLength; i++) {
            let parent1 = topPerformers[Math.round(Math.random() * (this.selectionCount - 1))];
            let parent2 = topPerformers[Math.round(Math.random() * (this.selectionCount - 1))];

            let mid = Math.round(Math.random() * (this.geneLength) / 2);
            let half1 = parent1.genes.slice(0, mid);
            let half2 = parent2.genes.slice(mid, this.geneLength);
            let newGene = this.getNewGene();
            newGene.genes = (Math.random() < 0.5) ? half1.concat(half2) : half2.concat(half1);
            newGene.fitness = newGene.applyMutation(undefined, this._targetGene);
            population.push(newGene);
        }

        this.population = topPerformers.concat(population);
    }
}