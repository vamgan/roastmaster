
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { LLMService } from './services/ai';
import { PERSONAS, PersonaType } from './services/persona';

const program = new Command();
const llmService = new LLMService();

program
  .name('roastmaster')
  .description('The CLI that roasts your code (and maybe fixes it)')
  .version('1.0.0');

program
  .command('roast <file>')
  .description('Roast a file with ruthless efficiency')
  .option('-p, --persona <type>', 'Choose your roast master: roast, hype, senior', 'roast')
  .action(async (file, options) => {
    try {
      if (!fs.existsSync(file)) {
        console.error(chalk.red(`❌ Bro, file "${file}" doesn't exist. Check your path.`));
        return;
      }

      console.log(chalk.yellow(`🔥 Heating up the grill for ${file}...`));
      
      const content = await fs.readFile(file, 'utf-8');
      const roast = await llmService.analyzeCode(content, options.persona as PersonaType, file);

      console.log('\n' + chalk.bold.cyan('--- ROAST SERVED ---') + '\n');
      console.log(roast);
      console.log('\n' + chalk.gray('(You survived... barely.)'));

    } catch (error) {
       // @ts-ignore
      console.error(chalk.red(`💥 Critical Failure: ${error.message}`));
    }
  });

program
  .command('fix <file>')
  .description('Fix a file (but with attitude)')
  .option('-p, --persona <type>', 'Choose your fixer: roast, hype, senior', 'roast')
  .action(async (file, options) => {
    try {
        if (!fs.existsSync(file)) {
          console.error(chalk.red(`❌ Bro, file "${file}" doesn't exist. Check your path.`));
          return;
        }
  
        console.log(chalk.blue(`🔧 Attempting to un-break ${file}...`));
        
        const content = await fs.readFile(file, 'utf-8');
        const fixedCode = await llmService.fixCode(content, options.persona as PersonaType, file);
        
        // Backup original
        const backupPath = `${file}.bak`;
        await fs.copy(file, backupPath);
        console.log(chalk.gray(`(Backed up original to ${backupPath} just in case I hallucinate)`));
  
        // Write fix
        await fs.writeFile(file, fixedCode);

        console.log('\n' + chalk.green('✅ Code fixed (I think). Check the comments for wisdom.') + '\n');
  
      } catch (error) {
         // @ts-ignore
        console.error(chalk.red(`💥 Critical Failure: ${error.message}`));
      }
  });


program.parse();
