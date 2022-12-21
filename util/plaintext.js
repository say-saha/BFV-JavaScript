class Plaintext {
      constructor(poly, scaling_factor) {
            this.poly = poly;
            if(arguments.length > 1) {
                  this.scaling_factor = scaling_factor;
            }
      }
}

module.exports = Plaintext;