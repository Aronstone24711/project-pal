import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, action, projectId, components, language = 'en', englishLevel = 'medium' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let messages: any[] = [];
    
    if (action === 'identify') {
      // Identify ANY items from image - electronics, craft supplies, household items, anything!
      messages = [
        {
          role: "system",
          content: `You are an expert item identifier for DIY and craft projects. Analyze the image and identify ALL items visible - this can include:
- Electronic components (Arduino, sensors, LEDs, wires, etc.)
- Craft supplies (paper, cardboard, fabric, glue, tape, etc.)
- Household items (bottles, cans, containers, rubber bands, etc.)
- Office supplies (pencils, pens, paper clips, rulers, etc.)
- Recycled materials (toilet paper rolls, egg cartons, plastic bottles, etc.)
- Natural materials (sticks, leaves, stones, etc.)
- Tools (scissors, rulers, etc.)
- Anything else that could be used to make something creative!
          
Return a JSON response with this exact structure:
{
  "components": [
    {
      "name": "Item Name",
      "type": "electronic|craft|household|tool|recycled|natural|office|other",
      "quantity": 1,
      "description": "Brief description of this item and what it could be used for"
    }
  ],
  "confidence": "high|medium|low"
}

Be thorough and identify EVERYTHING you can see - paper, pencils, used pens, cardboard, bottles, string, tape, etc. Think creatively about what projects could use these items.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify all items in this image that could be used for DIY projects, crafts, or creative builds."
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ];
    } else if (action === 'suggest_projects') {
      // Suggest projects based on identified items (can be anything!)
      const languageInstruction = language !== 'en' 
        ? `IMPORTANT: Respond with all text content (name, description, tags) in ${language} language.` 
        : '';
      
      const complexityInstruction = englishLevel === 'easy' 
        ? 'Use very simple, short sentences. Avoid technical jargon. Write as if explaining to an 8-year-old child.'
        : englishLevel === 'hard'
        ? 'Use technical terminology and detailed explanations suitable for experienced makers and engineers.'
        : 'Use clear, standard vocabulary with straightforward explanations.';
      
      messages = [
        {
          role: "system",
          content: `You are a creative DIY project expert. Based on the items provided (which could be electronics, craft supplies, household items, recycled materials, office supplies, or anything else), suggest creative and fun projects that can be made.

Projects can include:
- Electronics projects (if electronic components are available)
- Paper crafts (origami, paper airplanes, cards, etc.)
- Art projects (drawings, sculptures, collages)
- Useful items (organizers, holders, decorations)
- Toys and games
- Science experiments
- Recycled art
- Any creative build!

${languageInstruction}
${complexityInstruction}

Return a JSON response with this exact structure:
{
  "projects": [
    {
      "id": "unique-id",
      "name": "Project Name",
      "difficulty": "beginner|intermediate|advanced",
      "description": "Brief description of what the project does or creates",
      "estimatedTime": "30 mins",
      "componentsUsed": ["Item 1", "Item 2"],
      "tags": ["Craft", "Fun", "Educational", "Decoration", "Toy", "Useful"]
    }
  ]
}

Suggest 5-8 diverse projects ranging from simple to complex. Be creative! Think about what fun things can be made with everyday items.`
        },
        {
          role: "user",
          content: `Suggest creative projects I can make with these items: ${JSON.stringify(components)}`
        }
      ];
    } else if (action === 'get_instructions') {
      // Get detailed instructions for a specific project (works for any type of project)
      const languageInstruction = language !== 'en' 
        ? `IMPORTANT: Respond with all text content (name, overview, descriptions, tips, explanations, testing steps, troubleshooting) in ${language} language. Keep technical terms like pin names and code in English if applicable.` 
        : '';
      
      const complexityInstruction = englishLevel === 'easy' 
        ? 'CRITICAL: Use very simple words and short sentences. Explain everything as if teaching an 8-year-old child. Avoid all technical jargon - use everyday words instead.'
        : englishLevel === 'hard'
        ? 'Use technical terminology freely. Include detailed explanations of why each step is necessary. Suitable for experienced makers.'
        : 'Use clear, standard vocabulary. Explain terms when first used. Balance between accessibility and accuracy.';
      
      messages = [
        {
          role: "system",
          content: `You are a DIY project instructor. Provide detailed, step-by-step instructions for making the project. This could be an electronics project, a craft, a paper creation, or anything else!

${languageInstruction}
${complexityInstruction}

Return a JSON response with this exact structure:
{
  "project": {
    "name": "Project Name",
    "overview": "What this project creates and why it's fun/useful",
    "components": [
      {
        "name": "Item Name",
        "quantity": 1,
        "notes": "Any specific notes about this item"
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": "Step Title",
        "description": "Detailed description of what to do",
        "connections": [
          {
            "from": "Part A",
            "to": "Part B",
            "wireColor": "optional - for electronic projects"
          }
        ],
        "tips": ["Helpful tip for this step"],
        "imageDescription": "Description of what the project should look like at this stage"
      }
    ],
    "code": {
      "filename": "project_code.ino",
      "code": "// Code here - only if this is an electronics project, otherwise leave empty",
      "explanation": "Explanation of the code - only if applicable"
    },
    "testing": ["Step 1 to test or verify", "Step 2 to check"],
    "troubleshooting": [
      {
        "problem": "Common problem",
        "solution": "How to fix it"
      }
    ]
  }
}

Be extremely detailed with instructions. For craft projects, describe folding, cutting, gluing steps clearly. For electronics, use specific pin numbers.`
        },
        {
          role: "user",
          content: `Provide detailed build instructions for this project: ${projectId}. Available items: ${JSON.stringify(components)}`
        }
      ];
    } else if (action === 'fix_code') {
      // Fix code based on user's problem description
      const { currentCode, problemDescription, deviceType, language: lang = 'en' } = await req.json();
      
      const languageInstruction = lang !== 'en' 
        ? `IMPORTANT: Respond with all text content (analysis, explanation, tips) in ${lang} language. Keep code and technical terms in English.` 
        : '';
      
      messages = [
        {
          role: "system",
          content: `You are an expert embedded systems programmer specializing in Arduino, Raspberry Pi, ESP32, ESP8266, and other microcontrollers. A user is having issues with their code and needs help fixing it.
${languageInstruction}
Analyze the problem, identify the issue, and provide a corrected version of the code.

Return a JSON response with this exact structure:
{
  "analysis": {
    "problemIdentified": "Clear description of what's wrong",
    "cause": "Why this problem occurs",
    "deviceCompatibility": "Notes about device-specific issues if any"
  },
  "fixedCode": {
    "filename": "fixed_project.ino",
    "code": "// The complete corrected code here",
    "changes": ["List of specific changes made to fix the code"]
  },
  "explanation": "Detailed explanation of what was fixed and why",
  "tips": ["Additional tips to prevent similar issues"],
  "deviceNotes": "Any specific notes for the target device (${deviceType})"
}

Be thorough in your analysis. Consider:
- Pin compatibility for the specific device
- Library compatibility
- Voltage level differences
- Memory constraints
- Timing issues
- Common beginner mistakes`
        },
        {
          role: "user",
          content: `I'm using a ${deviceType}. Here's my current code:

\`\`\`
${currentCode}
\`\`\`

My problem: ${problemDescription}

Please analyze and fix the code.`
        }
      ];
    }

    console.log(`Processing ${action} request...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received successfully");

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { raw: content };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-components:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
