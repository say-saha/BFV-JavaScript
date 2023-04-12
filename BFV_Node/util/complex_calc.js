const Complex = require('./complex.js');
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

module.exports={complex_add, complex_sub, complex_mul, complex_div};