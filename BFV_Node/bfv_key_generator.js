const SecretKey = require('./util/secret_key.js');
const PublicKey = require('./util/public_key.js');
const RelinKey = require('./util/relin_key.js');
const Polynomial = require('./util/polynomial.js');
const RandomSample = require('./util/random_sample.js');

class BFVKeyGenerator {
      constructor(params) {
            this.secret_key = this.generate_secret_key(params);
            this.public_key = this.generate_public_key(params);
            this.relin_key = this.generate_relin_key(params);
      }

      generate_secret_key(params) {
            let poly_coeff = RandomSample.sample_triangle(params.poly_degree);
            let poly = new Polynomial(params.poly_degree, poly_coeff);
            let secret_key = new SecretKey(poly);
            return secret_key;
      }

      generate_public_key(params) {
            let uniform_sample = RandomSample.sample_uniform(0, params.cipher_modulus, params.poly_degree);
            let pk_coeff = new Polynomial(params.poly_degree, uniform_sample);
            let gauss_sample = RandomSample.sample_gauss(params.poly_degree, 3.2);
            let pk_error = new Polynomial(params.poly_degree, gauss_sample);

            let p0 = pk_coeff.multiply(this.secret_key.s, params.cipher_modulus);
            p0 = pk_error.add(p0, params.cipher_modulus);
            p0 = p0.scalar_multiply(-1, params.cipher_modulus);
            let p1 = pk_coeff;
            let public_key = new PublicKey(p0, p1);
            return public_key;
      }

      generate_relin_key(params) {
            let base = Math.ceil(Math.sqrt(params.cipher_modulus));
            let num_levels = Math.floor(Math.log(params.cipher_modulus)/Math.log(base)) + 1;

            let keys = new Array(num_levels).fill(0);
            let power = 1;
            let sk_squared = this.secret_key.s.multiply(this.secret_key.s, params.cipher_modulus);

            for(let i=0; i<num_levels; i++) {
                  let k1 = new Polynomial(params.poly_degree, RandomSample.sample_uniform(0, params.cipher_modulus, params.poly_degree));
                  let error = new Polynomial(params.poly_degree, RandomSample.sample_gauss(params.poly_degree, 3.2))
                  let k0 = this.secret_key.s.multiply(k1, params.cipher_modulus).add(error, params.cipher_modulus).scalar_multiply(-1).add(sk_squared.scalar_multiply(power), params.cipher_modulus).mod(params.cipher_modulus);
                  keys[i] = [k0, k1]
                  power = power * base;
                  power = ((power % params.cipher_modulus) + params.cipher_modulus) % params.cipher_modulus;
            }

            let relin_key = new RelinKey(base, keys);
            return relin_key;
      }

      print_keys() {
            console.log("Secret Key: ", this.secret_key);
            console.log("Public Key: ", this.public_key);
            console.log("Relinearization Key: ");
            for(let i=0;i<this.relin_key.keys.length;i++){
                  console.log("K"+i, ": ");
                  for(let j=0;j<this.relin_key.keys[i].length;j++)
                        console.log(this.relin_key.keys[i][j]);
            }
      }
}

module.exports = BFVKeyGenerator