var sample_triangle = (sample_count) => {
      // Samples from a discrete triangle distribution.

      // Samples num_samples values from [-1, 0, 1] with probabilities
      // [0.25, 0.5, 0.25], respectively.

      // Args:
      //       num_samples (int): Number of samples to be drawn.

      // Returns:
      //       A list of randomly sampled values.

      let sample = new Array(sample_count).fill(0);

      for(let i=0; i<sample_count; i++){
            let random = Math.floor(Math.random() * (3 - 0 + 1) + 0);
            if (random == 0)
                  sample[i] = -1;
            else if (random == 1)
                  sample[i] = 1;
            else  
                  sample[i] = 0;
      }
      return sample;
} 

var sample_uniform = (min_val, max_val, sample_count) => {
      // Samples from a uniform distribution.

      // Samples num_samples integer values from the range [min, max)
      // uniformly at random.

      // Args:
      //       min_val (int): Minimum value (inclusive).
      //       max_val (int): Maximum value (exclusive).
      //       num_samples (int): Number of samples to be drawn.

      // Returns:
      //       A list of randomly sampled values.
    
      if (sample_count == 1)
            return Math.floor(Math.random() * ((max_val-1) - min_val + 1) + min_val);
      
      let uniform_sample = new Array(sample_count).fill(0);
      for(let i=0; i<sample_count; i++)
            uniform_sample[i] =  Math.floor(Math.random() * ((max_val-1) - min_val + 1) + min_val);
      
      return uniform_sample;
}

class SecretKey {
      constructor(s) {
            this.s = s;
      }
}

class PublicKey {
      constructor(p0, p1) {
            this.p0 = p0;
            this.p1 = p1;
      }
}

class RelinKey {
      constructor(base, keys) {
            this.base = base;
            this.keys = keys;
      }
}

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
            let c0 = cipher1.c0.multiply_fft(cipher2.c0);
      }
}

class Polynomial {
      constructor(poly_degree, coeffs) {
            this.poly_degree = poly_degree;
            this.coeffs = coeffs;
      }   
      
      add(poly, coeff_modulus) {
            let sum = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0));
            for(let i=0; i<this.poly_degree; i++){
                  sum.coeffs[i] = this.coeffs[i] + poly.coeffs[i];
            }
            if(arguments.length > 1){
                  sum = sum.mod(coeff_modulus)
            }
            return sum;
      }

      multiply(poly, coeff_modulus) {
            let mul = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0));
            for(let d=0; d<(2*this.poly_degree)-1; d++){
                  let index = d%this.poly_degree;
                  let sign = 0;
                  if(d<this.poly_degree)
                        sign = 1;
                  else
                        sign = -1;
                  
                  let coeff = 0;
                  for(let i=0; i<this.poly_degree; i++){
                        if((d-i)>=0 && (d-i)<this.poly_degree)
                              coeff = coeff + this.coeffs[i] * poly.coeffs[d-i];
                  }
                  mul.coeffs[index] = mul.coeffs[index] + (sign * coeff);
                  if(arguments.length > 1) {
                        mul.coeffs[index] = mul.coeffs[index] % coeff_modulus;
                  }
            }
            return mul;                  
      }

      scalar_multiply(scalar, coeff_modulus) {
            let new_coeffs = new Array(this.poly_degree).fill(0);
            if(arguments.length == 1)
                  for(let i=0; i<this.poly_degree; i++){
                        new_coeffs[i] = this.coeffs[i] * scalar;
                  }
            else
                  for(let i=0; i<this.poly_degree; i++){
                        new_coeffs[i] = (this.coeffs[i] * scalar) % coeff_modulus;
                  }
            return new Polynomial(this.poly_degree, new_coeffs);
      }

      mod(coeff_modulus) {
            let new_coeffs = new Array(this.poly_degree).fill(0);
            for(let i=0; i<this.poly_degree; i++)
                  new_coeffs[i] = this.coeffs[i] % coeff_modulus;
            return new Polynomial(this.poly_degree, new_coeffs);
      }

      round() {
            let new_coeffs = new Array(this.poly_degree).fill(0);
            for(let i=0;i<this.poly_degree;i++){
                  new_coeffs[i] = Math.round(this.coeffs[i]);
            }
            return new Polynomial(this.poly_degree, new_coeffs)
      }
}

class Plaintext {
      constructor(poly, scaling_factor) {
            this.poly = poly;
            if(arguments.length > 1) {
                  this.scaling_factor = scaling_factor;
            }
      }
}

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

class BFVDecryptor {
      constructor(params, secret_key) {
            this.poly_degree = params.poly_degree;
            this.cipher_modulus = params.cipher_modulus;
            this.plain_modulus = params.plain_modulus;
            this.scaling_factor = params.scaling_factor;
            this.secret_key = secret_key;
      }

      decrypt(ciphertext_poly, c2) {
            let c0 = ciphertext_poly.c0;
            let c1 = ciphertext_poly.c1;
            // let intermed_message = c0.add(c1.multiply(this.secret_key.s, this.cipher_modulus), this.cipher_modulus); //Issue here
            let intermed_message = c1.multiply(this.secret_key.s, this.cipher_modulus);
            intermed_message = c0.add(intermed_message, this.cipher_modulus);

            if (arguments.length > 1) {
                let secret_key_squared = this.secret_key.s.multiply(this.secret_key.s, this.cipher_modulus);
                intermed_message = intermed_message.add(c2.multiply(secret_key_squared, this.cipher_modulus), this.cipher_modulus);
            }
            intermed_message = intermed_message.scalar_multiply(1 / this.scaling_factor);
            intermed_message = intermed_message.round();
            intermed_message = intermed_message.mod(this.plain_modulus);
            return new Plaintext(intermed_message);
      }
}

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
            
            let random_vec = new Polynomial(this.poly_degree, sample_triangle(this.poly_degree));

            let error1 = new Polynomial(this.poly_degree, sample_triangle(this.poly_degree));
            // error1 = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0)); //TODO: Not sure why error1 is re-declared with empty array
            let error2 = new Polynomial(this.poly_degree, sample_triangle(this.poly_degree));
            // error2 = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0)); //TODO: Not sure why error2 is re-declared with empty array

            let c0 = error1.add(p0.multiply(random_vec, this.coeff_modulus), this.coeff_modulus).add(scaled_message, this.coeff_modulus);
            let c1 = error2.add(p1.multiply(random_vec, this.coeff_modulus), this.coeff_modulus);

            return new Ciphertext(c0, c1);
      }
}

class IntegerEncoder {
      constructor(params, base=2) {
            this.base = base;
            this.poly_degree = params.poly_degree;
      }

      encode(value) {
            let coeffs = new Array(this.poly_degree).fill(0);
            let i = 0;
            while(value >= 1) {
                  coeffs[i] = parseInt(value % this.base);
                  value = value / this.base;
                  i = i + 1;
            }
            return new Polynomial(this.poly_degree, coeffs);
      }

      decode(plain_poly) {
            let value = 0;
            let power = 1;
            for(let i=0; i<this.poly_degree; i++){
                  value = value + (plain_poly.poly.coeffs[i] * power); //TODO: verify the plain_poly structure once decryption is done
                  power = power * this.base;
            }
            return value;
      }
}

class BFVKeyGenerator {
      constructor(params) {
            this.secret_key = this.generate_secret_key(params);
            this.public_key = this.generate_public_key(params);
            this.relin_key = this.generate_relin_key(params);
      }

      generate_secret_key(params) {
            let poly_coeff = sample_triangle(params.poly_degree);
            let poly = new Polynomial(params.poly_degree, poly_coeff);
            let secret_key = new SecretKey(poly);
            return secret_key;
      }

      generate_public_key(params) {
            let uniform_sample = sample_uniform(0, params.cipher_modulus, params.poly_degree);
            let pk_coeff = new Polynomial(params.poly_degree, uniform_sample);
            let triangle_sample = sample_triangle(params.poly_degree);
            let pk_error = new Polynomial(params.poly_degree, triangle_sample);

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
                  let k1 = new Polynomial(params.poly_degree, sample_uniform(0, params.cipher_modulus, params.poly_degree));
                  let error = new Polynomial(params.poly_degree, sample_triangle(params.poly_degree))
                  let k0 = this.secret_key.s.multiply(k1, params.cipher_modulus).add(error, params.cipher_modulus).scalar_multiply(-1).add(sk_squared.scalar_multiply(power), params.cipher_modulus).mod(params.cipher_modulus);
                  keys[i] = [k0, k1]
                  power = power * base;
                  power = power % params.cipher_modulus;
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

class BFVParameters {
      constructor(poly_degree, plain_modulus, cipher_modulus) {
            this.poly_degree = poly_degree;
            this.plain_modulus = plain_modulus;
            this.cipher_modulus = cipher_modulus;
            this.scaling_factor = this.cipher_modulus / this.plain_modulus;
      }

      print_parameters() {
            console.log("BFV Parameters: ");
            console.log("Polynomial Degree: ", this.poly_degree);
            console.log("Plaintext Modulus: ", this.plain_modulus);
            console.log("Ciphertext Modulus: ", this.cipher_modulus);
      }
}

function enc(){
      var startTime = performance.now();
      let degree = 64;
      let plain_modulus = 17;
      let cipher_modulus = 8000000000000000;
      
      const params = new BFVParameters(degree, plain_modulus, cipher_modulus);
      const key_generator = new BFVKeyGenerator(params);

      key_generator.print_keys();

      const secret_key = key_generator.secret_key;
      const public_key = key_generator.public_key;
      const relin_key = key_generator.relin_key;

      const encoder = new IntegerEncoder(params);
      // console.log("Main public key: ", public_key);
      const encryptor = new BFVEncryptor(params, public_key);
      const decryptor = new BFVDecryptor(params, secret_key);
      const evaluator = new BFVEvaluator(params);
      // let count =0;
      // for (let i=0;i<1;i++){
      // secret_key.s.coeffs = [0, 1, 1, 0, -1, 0, 1, 0]; //For decryption testing. Expected output 50
      // const evaluator = BFVEvaluator(params)

      let message1 = 5;
      // let message2 = 10;

      let encoded_plain1 = encoder.encode(message1);
      // console.log(encoded_plain1)
      // let encoded_plain2 = encoder.encode(message2);
      let cipher1 = encryptor.encrypt(encoded_plain1);
      // cipher1.c0.coeffs = [1544804108889, 272864661869, 3001671868583, 7299489070235, 2223910876487, 6786482753335, 6850526785227, 2118359065704]; //For decryption testing. Expected output 50
      // cipher1.c1.coeffs = [4259799624991, 5326150737376, 774456637768, 521014184092, 3847216647061, 1816911683138, 7259589753609, 5357980941848]; //For decryption testing. Expected output 50
      // console.log("Encrypted number: ", cipher1);
      let add = evaluator.add(cipher1, cipher1);
      for(let i=0;i<1;i++)
            add = evaluator.add(add,cipher1);
      console.log("Cipher text: ", add);
      let decrypted_encoded = decryptor.decrypt(add);
      // console.log("Decrypted encoded: ", decrypted_encoded);
      let decrypted = encoder.decode(decrypted_encoded);
      console.log("Decrypted: ", decrypted);
      var endTime = performance.now()

      console.log(`Time taken ${endTime - startTime} milliseconds`)      
}

