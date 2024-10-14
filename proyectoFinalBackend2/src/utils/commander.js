import { Command } from 'commander';

const program = new Command();

program
    .option("-p <port>", "puerto en el que se inicia el servidor", 3000)
    .option("--mode <mode>", "modo de inicio del servidor", "normal")
program.parse();

console.log("Opciones: ", program.opts());

export default program;