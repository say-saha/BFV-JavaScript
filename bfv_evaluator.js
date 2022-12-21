const Ciphertext = require('./util/ciphertext.js');

class BFVEvaluator {
      constructor(params) {
            this.plain_modulus = params.plain_modulus;
            this.coeff_modulus = params.cipher_modulus;
            this.scaling_factor = params.scaling_factor;
      }

      add(cipher1, cipher2) {
            let new_c0 = cipher1.c0.add(cipher2.c0, this.coeff_modulus);
            let new_c1 = cipher1.c1.add(cipher2.c1, this.coeff_modulus);

            return new Ciphertext(new_c0, new_c1);
      }

      multiply(cipher1, cipher2, relin_key) {
            // console.log("C0: ", cipher2.c0)
            let c0 = cipher1.c0.multiply_fft(cipher2.c0);
            c0 = c0.scalar_multiply(1 / this.scaling_factor)
            c0 = c0.round().mod(this.coeff_modulus)

            let c1 = cipher1.c0.multiply_fft(cipher2.c1).add(cipher1.c1.multiply_fft(cipher2.c0));
            c1 = c1.scalar_multiply(1 / this.scaling_factor);
            c1 = c1.round().mod(this.coeff_modulus);
    
            let c2 = cipher1.c1.multiply_fft(cipher2.c1);
            c2 = c2.scalar_multiply(1 / this.scaling_factor);
            c2 = c2.round().mod(this.coeff_modulus);

            // console.log("In mul c0: ", c0);
            // console.log("In mul c1: ", c1);
            // console.log("In mul c2: ", c2);
            return this.relinearize(relin_key, c0, c1, c2);
      }

      relinearize(relin_key, c0, c1, c2) {
            // Relinearizes a 3-dimensional ciphertext.

            // Reduces 3-dimensional ciphertext back down to 2 dimensions.

            // Args:
            // relin_key (RelinKey): Relinearization keys.
            // c0 (Polynomial): First component of ciphertext.
            // c1 (Polynomial): Second component of ciphertext.
            // c2 (Polynomial): Third component of ciphertext.

            // Returns:
            // A Ciphertext which has only two components.

            let keys = relin_key.keys;
            let base = relin_key.base;
            let num_levels = keys.length;

            let c2_decomposed = c2.base_decompose(base, num_levels);

            let new_c0 = c0;
            let new_c1 = c1;

            for(let i=0; i<num_levels; i++) {
                  new_c0 = new_c0.add(keys[i][0].multiply(c2_decomposed[i], this.coeff_modulus), this.coeff_modulus);
                  new_c1 = new_c1.add(keys[i][1].multiply(c2_decomposed[i], this.coeff_modulus), this.coeff_modulus);
            }
            // console.log("In Relin c0: ", new_c0);
            // console.log("In Relin c1: ", new_c1);
            return new Ciphertext(new_c0, new_c1);
      }
}

module.exports = BFVEvaluator;