var sample_triangle = (sample_count) => {
      // Samples from a discrete triangle distribution.

      // Samples num_samples values from [-1, 0, 1] with probabilities
      // [0.25, 0.5, 0.25], respectively.

      // Args:
      //       num_samples (int): Number of samples to be drawn.

      // Returns:
      //       A list of randomly sampled values.

      let sample = new Array((sample_count).toNumber()).fill(0);

      for(let i=0; i<(sample_count).toNumber(); i++){
            let random = Math.floor(Math.random() * (3 - 0 + 1) + 0);
            if (random == 0)
                  sample[i] = new BigNumber(-1);
            else if (random == 1)
                  sample[i] = new BigNumber(1);
            else  
                  sample[i] = new BigNumber(0);
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
    
      if ((sample_count).toNumber() == 1)
            return new BigNumber(Math.floor(Math.random() * ((max_val.toNumber()-1) - min_val + 1) + min_val)); //Assuming max_val within the range of 2^53
      
      let uniform_sample = new Array((sample_count).toNumber()).fill(0);
      for(let i=0; i<sample_count; i++)
            uniform_sample[i] =  new BigNumber(Math.floor(Math.random() * ((max_val.toNumber()-1) - min_val + 1) + min_val)); //Assuming max_val within the range of 2^53
      
      return uniform_sample;
}
var complex_add = (num1, num2) => {
      let real, imaginary;
      if (num1 instanceof Complex && num2 instanceof Complex){
            real = num1.real + num2.real;
            imaginary = num1.imaginary + num2.imaginary;
      }
      else if (num1 instanceof Complex && !(num2 instanceof Complex)) {
            real = num1.real + num2;
            imaginary = num1.imaginary;
      }
      else {
            real = num1 + num2.real;
            imaginary = num2.imaginary;
      }
      return new Complex(real, imaginary);
}

var complex_sub = (num1, num2) => {
      let real, imaginary;
      if (num1 instanceof Complex && num2 instanceof Complex){
            real = num1.real - num2.real;
            imaginary = num1.imaginary - num2.imaginary;
      }
      else if (num1 instanceof Complex && !(num2 instanceof Complex)) {
            real = num1.real - num2;
            imaginary = num1.imaginary;
      }
      else {
            real = num1 - num2.real;
            imaginary = num2.imaginary;
      }
      return new Complex(real, imaginary);
}

var complex_mul = (num1, num2) => {
      let real, imaginary;
      if (num1 instanceof Complex && num2 instanceof Complex){
            real = (num1.real * num2.real) - (num1.imaginary * num2.imaginary);
            imaginary = (num1.real * num2.imaginary) + (num1.imaginary * num2.real);
      }
      else if (num1 instanceof Complex && !(num2 instanceof Complex)) {
            real = num1.real * num2;
            imaginary = num1.imaginary;
      }
      else {
            real = num1 * num2.real;
            imaginary = num2.imaginary;
      }
      return new Complex(real, imaginary);
}

var complex_div = (num1, num2) => {
      let real, imaginary;
      if (num1 instanceof Complex && num2 instanceof Complex){
            real = ((num1.real * num2.real) + (num1.imaginary * num2.imaginary)) / (Math.pow(num2.real, 2) + Math.pow(num2.imaginary, 2));
            imaginary = ((num1.imaginary * num2.real) - (num1.real * num2.imaginary)) / (Math.pow(num2.real, 2) + Math.pow(num2.imaginary, 2));
      }
      else if (num1 instanceof Complex && !(num2 instanceof Complex)) {
            real = num1.real / num2;
            imaginary = num1.imaginary / num2;
      }
      else {
            console.log("Operation currently not supported!")
            real = num1.real / num2.real;
            imaginary = num1.imaginary / num2.imaginary;
      }
      return new Complex(real, imaginary);
}
var reverse_bits = (value, width) => {
      let bits_arr = value.toString(2).split('');
      bits_arr = bits_arr.reverse();
      let extra_bits = new Array(width-(bits_arr.length)).fill(0);
      let rev_bits_arr = bits_arr.concat(extra_bits);
      let reversed = parseInt(rev_bits_arr.join(''), 2);

      return reversed;
}

var bit_reverse_vec = (values) => {
      let result = new Array(values.length).fill(0);
      for(let i=0; i<values.length; i++) {
            console.log("Rev bits: ", values[reverse_bits(i, parseInt(Math.log2(values.length)))])
            result[i] = new BigNumber(values[reverse_bits(i, parseInt(Math.log2(values.length)))]);
      }

      console.log("Bit rev res: ", result)
      return result;
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
class Complex {
      constructor(real, imaginary) {
            this.real = real;
            this.imaginary = imaginary;
      }
}
class FFTContext {
      constructor(fft_length) {
            this.fft_length = fft_length;
            this.roots_of_unity = this.precompute_fft()[0];
            this.roots_of_unity_inv = this.precompute_fft()[1];
            this.reversed_bits = this.precompute_fft()[2];
            this.rot_group = this.precompute_fft()[3];
      }

      precompute_fft() {
            let roots_of_unity = new Array(this.fft_length).fill(0);
            let roots_of_unity_inv = new Array(this.fft_length).fill(0);
            
            for(let i=0; i<this.fft_length; i++) {
                  let angle = (2 * Math.PI * i) / this.fft_length;
                  roots_of_unity[i] = new Complex(new BigNumber(Math.cos(angle)), new BigNumber(Math.sin(angle)));
                  roots_of_unity_inv[i] = new Complex(new BigNumber(Math.cos(-angle)), new BigNumber(Math.sin(-angle)));
            }

            let num_slots = Math.floor(this.fft_length / 4);
            let reversed_bits = new Array(num_slots).fill(0);
            let width = parseInt(Math.log2(num_slots));
            for(let i=0; i<num_slots; i++) {
                  reversed_bits[i] = new BigNumber(((reverse_bits(i, width) % num_slots) + num_slots) % num_slots);
            }

            let rot_group = new Array(num_slots).fill(1);
            rot_group[0] = new BigNumber(rot_group[0]);
            for (let i=1; i<num_slots; i++) {
                  rot_group[i] = (rot_group[i-1].multipliedBy(5)).mod(this.fft_length); 
            }
            return [roots_of_unity, roots_of_unity_inv, reversed_bits, rot_group];
      }

      fft(coeffs, rou) {
            let num_coeffs = coeffs.length;
            console.log("Starting bit reverse")
            let result = bit_reverse_vec(coeffs);
            let log_num_coeffs = parseInt(Math.log2(num_coeffs));

            let butterfly_plus, butterfly_minus;

            for(let logm=1; logm<= log_num_coeffs; logm++){
                  for(let j=0; j<num_coeffs; j = j + (1 << logm)) {
                        for(let i=0; i<(1 << (logm - 1)); i++) {
                              let index_even = j + i;
                              let index_odd = j + i + (1 << (logm - 1));

                              let rou_index = (i * this.fft_length) >> logm;
                              let omega_factor = complex_mul(rou[rou_index], result[index_odd]);


                              butterfly_plus = complex_add(result[index_even], omega_factor);
                              butterfly_minus = complex_sub(result[index_even], omega_factor);

                              result[index_even] = butterfly_plus;
                              result[index_odd] = butterfly_minus;
                        }
                  }
            }
            return result;
      }

      fft_fwd(coeffs) {
            let fwd = this.fft(coeffs, this.roots_of_unity);
            return fwd;
      }

      fft_inv(coeffs) {
            let num_coeffs = coeffs.length;
            let result = this.fft(coeffs, this.roots_of_unity_inv);
            for(let i=0; i<num_coeffs; i++) {
                  result[i] = complex_div(result[i], num_coeffs);
            }

            return result;
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
class Polynomial {
      constructor(poly_degree, coeffs) {
            this.poly_degree = poly_degree;
            this.coeffs = coeffs;
      }   
      
      add(poly, coeff_modulus) {
            let sum = new Polynomial(this.poly_degree, new Array((this.poly_degree).toNumber()).fill(0));
            for(let i=0; i<(this.poly_degree).toNumber(); i++){
                  sum.coeffs[i] = this.coeffs[i].plus(poly.coeffs[i]);
            }
            if(arguments.length > 1){
                  sum = sum.mod(coeff_modulus)
            }
            return sum;
      }

      multiply(poly, coeff_modulus) {
            let mul = new Polynomial(this.poly_degree, new Array((this.poly_degree).toNumber()).fill(0));
            for(let d=0; d<(2*(this.poly_degree).toNumber())-1; d++){
                  d = new BigNumber(d);
                  let index = d.mod(this.poly_degree);
                  let sign = 0;
                  if(d.toNumber()<(this.poly_degree).toNumber())
                        sign = new BigNumber(1);
                  else
                        sign = new BigNumber(-1);

                  let coeff = new BigNumber(0);
                  for(let i=0; i<(this.poly_degree).toNumber(); i++){
                        i = new BigNumber(i);
                        if((d.toNumber()-i.toNumber())>=0 && (d.toNumber()-i.toNumber())<this.poly_degree)
                              coeff = coeff.plus(this.coeffs[i].multipliedBy(poly.coeffs[d-i]));
                  }
                  mul.coeffs[index] = (new BigNumber(mul.coeffs[index])).plus(sign.multipliedBy(coeff));
                  if(arguments.length > 1) {
                        mul.coeffs[index] = mul.coeffs[index].mod(coeff_modulus);
                  }
            }
            return mul;                  
      }

      scalar_multiply(scalar, coeff_modulus) {
            let new_coeffs = new Array((this.poly_degree).toNumber()).fill(0);
            if(arguments.length == 1)
                  for(let i=0; i<(this.poly_degree).toNumber(); i++){
                        new_coeffs[i] = this.coeffs[i].multipliedBy(scalar);
                  }
            else
                  for(let i=0; i<(this.poly_degree).toNumber(); i++){
                        new_coeffs[i] = (this.coeffs[i].multipliedBy(scalar)).mod(coeff_modulus);
                  }
            return new Polynomial(this.poly_degree, new_coeffs);
      }

      mod(coeff_modulus) {
            let new_coeffs = new Array((this.poly_degree).toNumber()).fill(0);
            for(let i=0; i<(this.poly_degree).toNumber(); i++)
                  new_coeffs[i] = this.coeffs[i].mod(coeff_modulus);
            return new Polynomial(this.poly_degree, new_coeffs);
      }

      round() {
            let new_coeffs = new Array((this.poly_degree).toNumber()).fill(0);
            for(let i=0;i<(this.poly_degree).toNumber();i++){
                  if (this.coeffs[i] instanceof Complex)
                        new_coeffs[i] = (this.coeffs[i].real).integerValue();
                  else
                        new_coeffs[i] = (this.coeffs[i]).integerValue();
            }
            return new Polynomial(this.poly_degree, new_coeffs)
      }

      multiply_fft(poly, round=true) {
            let fft = new FFTContext((this.poly_degree).toNumber()*8);
            let a = fft.fft_fwd(this.coeffs.concat(new Array((this.poly_degree).toNumber()).fill(new BigNumber(0))));
            console.log("FFT A: ", a);
            let b = fft.fft_fwd(poly.coeffs.concat(new Array(this.poly_degree).fill(0)));
            // console.log("B: ", b);
            let ab = new Array(this.poly_degree * 2).fill(0);
            for(let i=0; i< this.poly_degree * 2; i++) {
                  ab[i] = complex_mul(a[i], b[i]);
            }

            let prod = fft.fft_inv(ab);
            let poly_prod = new Array(this.poly_degree).fill(0);

            for(let d=0; d<(2*this.poly_degree-1); d++) {
                  let index = ((d % this.poly_degree) + this.poly_degree) % this.poly_degree;
                  let sign = 0;
                  if(d<this.poly_degree)
                        sign = 1;
                  else
                        sign = -1;
                  
                  poly_prod[index] = complex_add(poly_prod[index], complex_mul(sign, prod[d]));
            }

            if (round == true)
                  return new Polynomial(this.poly_degree, poly_prod).round();
            else
                  return new Polynomial(this.poly_degree, poly_prod);
      }

      base_decompose(base, num_levels) {
            let decomposed = new Array(num_levels);
            for (let i=0; i<num_levels; i++)
                  decomposed[i] = new Polynomial(this.poly_degree, new Array(this.poly_degree).fill(0));
            let poly = this;

            for(let i=0; i<num_levels; i++) {
                  decomposed[i] = poly.mod(base);
                  poly = poly.scalar_multiply(1/base).floor();
            }

            return decomposed;
      }

      floor() {
            let new_coeffs = new Array(this.coeffs.length).fill(0);
            for(let i=0; i<this.coeffs.length; i++) 
                  new_coeffs[i] = parseInt(this.coeffs[i]);
            
            return new Polynomial(this.poly_degree, new_coeffs);
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
class SecretKey {
      constructor(s) {
            this.s = s;
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
            console.log("Before scalling C0: ", c0)
            console.log("Scalling: ", (1/this.scaling_factor))
            c0 = c0.scalar_multiply(1 / this.scaling_factor)
            console.log("After scalling C0: ", c0, "\n")
            c0 = c0.round().mod(this.coeff_modulus)

            let c1 = cipher1.c0.multiply_fft(cipher2.c1).add(cipher1.c1.multiply_fft(cipher2.c0));
            c1 = c1.scalar_multiply(1 / this.scaling_factor);
            c1 = c1.round().mod(this.coeff_modulus);
    
            let c2 = cipher1.c1.multiply_fft(cipher2.c1);
            c2 = c2.scalar_multiply(1 / this.scaling_factor);
            c2 = c2.round().mod(this.coeff_modulus);

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
            return new Ciphertext(new_c0, new_c1);
      }
}
class IntegerEncoder {
      constructor(params, base=2) {
            this.base = base;
            this.poly_degree = params.poly_degree;
      }

      encode(value) {
            let coeffs = new Array((this.poly_degree).toNumber()).fill(new BigNumber(0));
            let i = 0;
            while(value >= 1) {
                  coeffs[i] = new BigNumber(parseInt(((value % this.base) + this.base) % this.base));
                  value = value / this.base;
                  i = i + 1;
            }
            return new Polynomial(this.poly_degree, coeffs);
      }

      decode(plain_poly) {
            let value = 0;
            let power = 1;
            for(let i=0; i<(this.poly_degree).toNumber(); i++){
                  value = value + ((plain_poly.poly.coeffs[i]).toNumber() * power);
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
            // TODO: assuming the cipher modulus less than 2^53 in this function
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
      let degree = new BigNumber(8);
      let plain_modulus = new BigNumber(17);
      let cipher_modulus = new BigNumber(8000000000000);
      const params = new BFVParameters(degree, plain_modulus, cipher_modulus);
      // let y = new BigNumber(0.77324294909025)
      // console.log("Round: ", y)
      const key_generator = new BFVKeyGenerator(params);
            
      const secret_key = key_generator.secret_key;
      const public_key = key_generator.public_key;
      const relin_key = key_generator.relin_key;
      
      const encoder = new IntegerEncoder(params);
      const encryptor = new BFVEncryptor(params, public_key);
      const decryptor = new BFVDecryptor(params, secret_key);
      const evaluator = new BFVEvaluator(params);
      // let count = 0;
      for (let i=0;i<1;i++){      
            // let message1 = Math.floor(Math.random() * 100);
            let message1 = 5;
            console.log("Number 1: ", message1);
            // let message2 = Math.floor(Math.random() * 100);
            let message2 = 5;
            console.log("Number 2: ", message2);
            // let message3 = Math.floor(Math.random() * 100);
            // let message3 = 2;
            // console.log("Number 3: ", message3);
      
            let encoded_plain1 = encoder.encode(message1);
            let encoded_plain2 = encoder.encode(message2);
            // let encoded_plain3 = encoder.encode(message3);
            let cipher1 = encryptor.encrypt(encoded_plain1);
            let cipher2 = encryptor.encrypt(encoded_plain2);
            // let cipher3 = encryptor.encrypt(encoded_plain3);
            // console.log("Cipher 1: ", cipher1);
            // console.log("Cipher 2: ", cipher2);

            let final = evaluator.multiply(cipher1, cipher2, relin_key); //TODO: continue multiply
      //       final = evaluator.multiply(final, cipher2, relin_key);
      //       // let final = evaluator.multiply(mul, mul, relin_key);
      //       // let final = evaluator.add(cipher1, cipher2);
      //       // console.log("Cipher text: ", final);
            // let final = evaluator.add(cipher1, cipher2)
            let decrypted_encoded = decryptor.decrypt(final);
            // console.log("Decrypted encoded: ", decrypted_encoded);
            let decrypted = encoder.decode(decrypted_encoded);
            console.log("Decrypted: ", decrypted);
      //       // if(Math.pow(message1, 3) == decrypted)
      //       //       count ++;
      }
      
      // // console.log("Count: ", count);
      var endTime = performance.now()
      console.log(`Time taken ${endTime - startTime} milliseconds`)  
}

