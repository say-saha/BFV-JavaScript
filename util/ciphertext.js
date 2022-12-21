class Ciphertext {
      constructor(c0, c1, scaling_factor, modulus) {
            this.c0 = c0;
            this.c1 = c1;
            if(arguments.length > 2) {
                  this.scaling_factor = scaling_factor;
                  this.modulus = modulus;
            }
      }
}

module.exports = Ciphertext;