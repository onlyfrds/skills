#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

class CoverLetterGenerator {
  constructor(workspaceDir = '/home/neo/clawd') {
    this.workspaceDir = workspaceDir;
    this.coverLettersDir = join(workspaceDir, 'skills', 'cover-letter-generator', 'cover-letters');
    
    // Create cover letters directory if it doesn't exist
    if (!existsSync(this.coverLettersDir)) {
      mkdirSync(this.coverLettersDir, { recursive: true });
    }
    
    // Load user's resume/skills data
    this.userDataFile = join(workspaceDir, 'skills', 'cover-letter-generator', 'user-data.json');
    this.loadUserData();
  }

  loadUserData() {
    if (existsSync(this.userDataFile)) {
      try {
        const data = readFileSync(this.userDataFile, 'utf8');
        this.userData = JSON.parse(data);
      } catch (error) {
        console.error('Error loading user data:', error.message);
        this.userData = this.getDefaultUserData();
      }
    } else {
      this.userData = this.getDefaultUserData();
      this.saveUserData();
    }
  }

  getDefaultUserData() {
    return {
      name: 'Neo',
      email: 'neo@example.com',
      phone: '+852 1234 5678',
      address: 'Tseung Kwan O, Hong Kong',
      skills: ['Project Management', 'AWS Solutions Architecture', 'TOGAF', 'CFA', 'CISM'],
      experience: [
        {
          position: 'Senior Developer',
          company: 'Example Company',
          duration: '2020-Present',
          responsibilities: ['Led development teams', 'Implemented cloud solutions']
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science',
          institution: 'University of Hong Kong',
          year: '2015'
        }
      ]
    };
  }

  saveUserData() {
    try {
      writeFileSync(this.userDataFile, JSON.stringify(this.userData, null, 2));
    } catch (error) {
      console.error('Error saving user data:', error.message);
      throw error;
    }
  }

  async generateCoverLetter(jobDescription, jobTitle = 'Position', companyName = 'Company') {
    // Prepare context for AI generation
    const context = {
      userData: this.userData,
      jobDescription: jobDescription,
      jobTitle: jobTitle,
      companyName: companyName
    };

    // Generate cover letter content using AI
    const coverLetterContent = await this.createCoverLetterContent(context);

    // Format the cover letter
    const formattedLetter = this.formatCoverLetter(coverLetterContent, companyName, jobTitle);

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `cover-letter-${companyName.replace(/\s+/g, '-')}-${timestamp}.pdf`;

    // Convert to PDF and save
    const filePath = join(this.coverLettersDir, filename);
    await this.convertToPDF(formattedLetter, filePath);

    return {
      success: true,
      filePath: filePath,
      filename: filename,
      content: formattedLetter
    };
  }

  async createCoverLetterContent(context) {
    // In a real implementation, this would call an AI service
    // For now, we'll simulate the AI-generated content
    const { userData, jobDescription, jobTitle, companyName } = context;

    // Extract relevant skills from job description
    const relevantSkills = this.extractRelevantSkills(jobDescription, userData.skills);

    // Create personalized cover letter
    const coverLetter = `
Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my extensive background in technology and business, I believe I would be an excellent addition to your team.

In my current role, I have developed expertise in areas that directly align with your job requirements. My experience includes:
${relevantSkills.map(skill => `- ${skill}`).join('\n')}

I am particularly drawn to this opportunity because of [specific reason related to company/job]. My passion for excellence and commitment to continuous learning make me well-suited for this role.

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experiences can contribute to ${companyName}'s continued success.

Sincerely,
${userData.name}
    `.trim();

    return coverLetter;
  }

  extractRelevantSkills(jobDescription, userSkills) {
    // Simple keyword matching to find relevant skills
    const lowerJobDesc = jobDescription.toLowerCase();
    const matchedSkills = userSkills.filter(skill => 
      lowerJobDesc.includes(skill.toLowerCase())
    );
    
    // If no skills match, return some general relevant skills
    if (matchedSkills.length === 0) {
      return ['JavaScript development', 'Front-end development', 'Problem solving', 'Code debugging'];
    }
    
    return matchedSkills;
  }

  formatCoverLetter(content, companyName, jobTitle) {
    const date = new Date().toLocaleDateString('en-HK');
    
    // Extract just the main content part from the generated cover letter
    const lines = content.split('\n');
    const startIndex = lines.findIndex(line => line.includes('Dear Hiring Manager'));
    const endIndex = lines.findIndex(line => line.includes('Sincerely,'));

    let mainContent = content;
    if (startIndex !== -1 && endIndex !== -1) {
      mainContent = lines.slice(startIndex, endIndex).join('\n');
    } else if (startIndex !== -1) {
      mainContent = lines.slice(startIndex).join('\n');
    }

    return `
${this.userData.name}
${this.userData.address}
${this.userData.email} | ${this.userData.phone}

${date}

Hiring Manager
${companyName}
[Company Address]

${mainContent}

Sincerely,
${this.userData.name}
    `.trim();
  }

  async convertToPDF(content, outputPath) {
    // Use PDFKit to generate a proper PDF
    try {
      const PDFDocument = (await import('pdfkit')).default;
      const fs = await import('fs');
      
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Set up basic styling
      doc.fontSize(12);

      // Split content into lines
      const lines = content.split('\n');
      
      let yPosition = 50; // Starting y position
      
      // Process each line of the cover letter
      for (const line of lines) {
        if (yPosition > 750) { // If we reach bottom of page, add new page
          doc.addPage();
          yPosition = 50;
        }
        
        if (line.trim() === '') {
          yPosition += 10; // Add spacing for empty lines
        } else if (line.includes('Sincerely,') || line.includes(this.userData.name)) {
          // Special formatting for closing
          doc.font('Helvetica-Bold').fontSize(12);
          doc.text(line.trim(), 50, yPosition);
          doc.font('Helvetica').fontSize(12);
          yPosition += 20;
        } else if (line.includes('Dear Hiring Manager')) {
          // Special formatting for greeting
          yPosition += 20;
          doc.text(line.trim(), 50, yPosition);
          yPosition += 20;
        } else {
          // Regular text
          doc.text(line.trim(), 50, yPosition);
          yPosition += 15;
        }
      }

      doc.end();
      
      // Wait for the PDF to finish writing
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });
      
      console.log(`PDF successfully created: ${outputPath}`);
    } catch (error) {
      console.error('Error generating PDF with PDFKit:', error.message);
      // Fallback to creating text version
      console.log('Creating text version as fallback');
      writeFileSync(outputPath.replace('.pdf', '.txt'), content);
    }
  }
}

// If running directly, provide a command-line interface
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [, , command, ...args] = process.argv;
  const generator = new CoverLetterGenerator();

  switch (command) {
    case 'generate':
      if (args.length < 1) {
        console.log('Usage: cover-letter generate <job_description_file> [job_title] [company_name]');
        process.exit(1);
      }

      const jobDescFile = args[0];
      const jobTitle = args[1] || 'JavaScript Developer';
      const companyName = args[2] || 'Tech Innovations Ltd';

      if (!existsSync(jobDescFile)) {
        console.log(`Job description file not found: ${jobDescFile}`);
        process.exit(1);
      }

      const jobDescription = readFileSync(jobDescFile, 'utf8');

      generator.generateCoverLetter(jobDescription, jobTitle, companyName)
        .then(result => {
          console.log(`Cover letter generated successfully!`);
          console.log(`File saved to: ${result.filePath}`);
        })
        .catch(error => {
          console.error('Error generating cover letter:', error.message);
          process.exit(1);
        });
      break;

    case 'update-profile':
      // Allow updating user profile information
      console.log('Updating user profile...');
      // Implementation would go here
      break;

    case 'list':
      // List previously generated cover letters
      console.log('Listing generated cover letters...');
      // Implementation would go here
      break;

    default:
      console.log(`
Cover Letter Generator

Usage:
  cover-letter generate <job_description_file> [job_title] [company_name]    Generate a cover letter
  cover-letter update-profile                                               Update your profile information
  cover-letter list                                                         List generated cover letters

Examples:
  cover-letter generate job-desc.txt "Software Engineer" "Tech Corp"
      `);
  }
}

export default CoverLetterGenerator;