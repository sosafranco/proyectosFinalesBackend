import { Command } from 'commander';
const program = new Command();

program
    .option('--mode <mode>', 'Modo de ejecucion')
program.parse();

export default program;