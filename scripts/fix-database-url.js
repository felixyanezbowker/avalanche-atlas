#!/usr/bin/env node

/**
 * Helper script to construct the correct DATABASE_URL for Supabase
 * Usage: node scripts/fix-database-url.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('=== Supabase DATABASE_URL Fixer ===\n');
  
  // Read existing .env.local if it exists
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  let existingVars = {};
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    // Parse existing vars
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        existingVars[key] = value;
      }
    });
  }
  
  // Get project reference from NEXT_PUBLIC_SUPABASE_URL
  let projectRef = '';
  if (existingVars.NEXT_PUBLIC_SUPABASE_URL) {
    const match = existingVars.NEXT_PUBLIC_SUPABASE_URL.match(/https?:\/\/([^.]+)\.supabase\.co/);
    if (match) {
      projectRef = match[1];
      console.log(`✓ Found project reference: ${projectRef}\n`);
    }
  }
  
  if (!projectRef) {
    projectRef = await question('Enter your Supabase project reference (the part before .supabase.co): ');
  }
  
  const password = 'p7UHjGbsvbWdk4l2';
  const databaseUrl = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;
  
  console.log('\n=== Generated DATABASE_URL ===');
  console.log(databaseUrl);
  console.log('\n');
  
  // Update .env.local
  if (existingVars.DATABASE_URL) {
    console.log('Updating existing DATABASE_URL in .env.local...');
    envContent = envContent.replace(
      /^DATABASE_URL=.*$/m,
      `DATABASE_URL=${databaseUrl}`
    );
  } else {
    console.log('Adding DATABASE_URL to .env.local...');
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += `DATABASE_URL=${databaseUrl}\n`;
  }
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✓ .env.local updated successfully!\n');
  console.log('Please restart your dev server for changes to take effect.');
  
  rl.close();
}

main().catch(console.error);

