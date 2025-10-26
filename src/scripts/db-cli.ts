#!/usr/bin/env tsx

import { Command } from 'commander';
import { migrateAllContent, migrateBlogPosts, migrateRecipes } from './migrate-content';
import { getAllBlogPosts, getAllRecipes, syncBlogPost, syncRecipe } from '../lib/content-sync';

const program = new Command();

program
  .name('db-cli')
  .description('CLI tool for managing blog posts and recipes database')
  .version('1.0.0');

// Migration commands
program
  .command('migrate')
  .description('Migrate all existing content to database')
  .action(async () => {
    try {
      console.log('🚀 Starting content migration...');
      await migrateAllContent();
      console.log('✅ Migration completed successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  });

program
  .command('migrate-blogs')
  .description('Migrate only blog posts to database')
  .action(async () => {
    try {
      console.log('🚀 Starting blog posts migration...');
      await migrateBlogPosts();
      console.log('✅ Blog posts migration completed successfully!');
    } catch (error) {
      console.error('❌ Blog posts migration failed:', error);
      process.exit(1);
    }
  });

program
  .command('migrate-recipes')
  .description('Migrate only recipes to database')
  .action(async () => {
    try {
      console.log('🚀 Starting recipes migration...');
      await migrateRecipes();
      console.log('✅ Recipes migration completed successfully!');
    } catch (error) {
      console.error('❌ Recipes migration failed:', error);
      process.exit(1);
    }
  });

// List commands
program
  .command('list-blogs')
  .description('List all blog posts in database')
  .action(async () => {
    try {
      const blogs = await getAllBlogPosts();
      console.log(`📝 Found ${blogs.length} blog posts:`);
      blogs.forEach((blog, index) => {
        console.log(`${index + 1}. ${blog.title} (${blog.slug})`);
      });
    } catch (error) {
      console.error('❌ Failed to list blog posts:', error);
      process.exit(1);
    }
  });

program
  .command('list-recipes')
  .description('List all recipes in database')
  .action(async () => {
    try {
      const recipes = await getAllRecipes();
      console.log(`🍳 Found ${recipes.length} recipes:`);
      recipes.forEach((recipe, index) => {
        console.log(`${index + 1}. ${recipe.title} (${recipe.difficulty})`);
      });
    } catch (error) {
      console.error('❌ Failed to list recipes:', error);
      process.exit(1);
    }
  });

// Sync commands
program
  .command('sync-blog')
  .description('Sync a specific blog post to database')
  .argument('<slug>', 'Blog post slug')
  .action(async (slug) => {
    try {
      console.log(`🔄 Syncing blog post: ${slug}`);
      // This would need the actual blog post data
      console.log('❌ This command requires blog post data. Use the API instead.');
    } catch (error) {
      console.error('❌ Failed to sync blog post:', error);
      process.exit(1);
    }
  });

program
  .command('sync-recipe')
  .description('Sync a specific recipe to database')
  .argument('<title>', 'Recipe title')
  .action(async (title) => {
    try {
      console.log(`🔄 Syncing recipe: ${title}`);
      // This would need the actual recipe data
      console.log('❌ This command requires recipe data. Use the API instead.');
    } catch (error) {
      console.error('❌ Failed to sync recipe:', error);
      process.exit(1);
    }
  });

// Help command
program
  .command('help')
  .description('Show help information')
  .action(() => {
    console.log(`
📚 Database CLI Help

Available commands:
  migrate          - Migrate all existing content to database
  migrate-blogs    - Migrate only blog posts to database
  migrate-recipes  - Migrate only recipes to database
  list-blogs       - List all blog posts in database
  list-recipes     - List all recipes in database
  sync-blog        - Sync a specific blog post to database
  sync-recipe      - Sync a specific recipe to database
  help             - Show this help message

Examples:
  npm run db-cli migrate
  npm run db-cli list-blogs
  npm run db-cli list-recipes
    `);
  });

program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
