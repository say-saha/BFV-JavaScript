class Complex {
      constructor(real, imaginary) {
            this.real = real;
            this.imaginary = imaginary;
      }

      complex_add(num) {
            let real = this.real + num.real;
            let imaginary = this.imaginary + num.imaginary;

            return new Complex(real, imaginary);
      }

      complex_sub(num) {
            let real = this.real - num.real;
            let imaginary = this.imaginary - num.imaginary;

            return new Complex(real, imaginary);
      }

      complex_mul(num) {
            let real = (this.real * num.real) - (this.imaginary * num.imaginary);
            let imaginary = (this.real * num.imaginary) + (this.imaginary * num.real);

            return new Complex(real, imaginary);
      }

      complex_scalar_mul(scalar) {
            let real = this.real * scalar;
            let imaginary = this.imaginary * scalar;

            return new Complex(real, imaginary);
      }
}

module.exports=Complex;