const Polynomial = require('./util/polynomial.js');
const RandomSample = require('./util/random_sample.js');
const Ciphertext = require('./util/ciphertext.js');

class BFVEncryptor {
      constructor(params, public_key) {
            this.poly_degree = params.poly_degree;
            this.coeff_modulus = params.cipher_modulus;
            this.public_key = public_key;
            this.scaling_factor = parseInt(params.scaling_factor);
      }

      encrypt(message_poly) {
            let p0 = this.public_key.p0;
            let p1 = this.public_key.p1;

            let scaled_message = message_poly.scalar_multiply(this.scaling_factor, this.coeff_modulus);
            
            let random_vec = new Polynomial(this.poly_degree, RandomSample.sample_triangle(this.poly_degree));

            let error1 = new Polynomial(this.poly_degree, RandomSample.sample_gauss(this.poly_degree, 3.2));
            // error1 = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0)); //TODO: Not sure why error1 is re-declared with empty array
            let error2 = new Polynomial(this.poly_degree, RandomSample.sample_gauss(this.poly_degree, 3.2));
            // error2 = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0)); //TODO: Not sure why error2 is re-declared with empty array

            let c0 = error1.add(p0.multiply(random_vec, this.coeff_modulus), this.coeff_modulus).add(scaled_message, this.coeff_modulus);
            let c1 = error2.add(p1.multiply(random_vec, this.coeff_modulus), this.coeff_modulus);

            return new Ciphertext(c0, c1);
      }
}

module.exports = BFVEncryptor;