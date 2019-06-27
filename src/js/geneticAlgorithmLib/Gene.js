class GA_Gene {
    constructor(geneLength, geneRange, mutationRate, geneRangeDecimal = false) {
        this._fitness = 0;
        this.geneLength = geneLength; // gene 
        this.mutationRate = mutationRate; // gene
        this.geneRange = geneRange; // gene
        this.geneRangeDecimal = geneRangeDecimal; // gene
        this.genes = []; // gene 
    }

    get fitness() {
        return this._fitness;
    }

    set fitness(value) {
        this._fitness = value;
    }

    getRandomChromosome() {
        let chromosome = this.geneRange[0] + (Math.random() * (this.geneRange[1] - this.geneRange[0]));
        // console.log(chromosome)
        if (!this.geneRangeDecimal)
        {
            
            // console.log(this.geneRangeDecimal)
            chromosome = Math.round(chromosome);
        }
        // console.log(chromosome)
        return chromosome;
    }

    applyRandomChromosome() {
        this.genes = [];
        for (let i = 0; i < this.geneLength; i++)
            this.genes.push(this.getRandomChromosome());
    }

    // calculate fitness and mutation 
    applyMutation(mutationRate, targetGene) {
        let matchCount = 0;
        // console.log('mutationRate1',mutationRate)
        mutationRate = (mutationRate !== undefined) ? mutationRate : this.mutationRate;
        // console.log('mutationRate2',mutationRate , this.mutationRate)
        // console.log(this.geneLength ,targetGene , this.getRandomChromosome() )
        for (let i = 0; i < this.geneLength; i++) {
            if (Math.random() < mutationRate)
                this.genes[i] = this.getRandomChromosome();

            if (targetGene.genes[i] === this.genes[i])
                matchCount++;
        }
        return (matchCount / this.geneLength) * 100;
    }
}