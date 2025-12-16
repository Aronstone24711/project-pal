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
      // Identify components from image
      messages = [
        {
          role: "system",
          content: `You are an expert electronics component identifier. Analyze the image and identify all Arduino, electronic components, sensors, and modules visible. 
          
Return a JSON response with this exact structure:
{
  "components": [
    {
      "name": "Component Name",
      "type": "sensor|actuator|module|board|passive|wire|power",
      "quantity": 1,
      "description": "Brief description of what this component does"
    }
  ],
  "confidence": "high|medium|low"
}

Be thorough and identify every component you can see including wires, resistors, LEDs, buttons, etc.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify all electronic components in this image."
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
      // Suggest projects based on identified components
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
          content: `You are an Arduino project expert. Based on the components provided, suggest creative and educational projects that can be built.
${languageInstruction}
${complexityInstruction}

Return a JSON response with this exact structure:
{
  "projects": [
    {
      "id": "unique-id",
      "name": "Project Name",
      "difficulty": "beginner|intermediate|advanced",
      "description": "Brief description of what the project does",
      "estimatedTime": "30 mins",
      "componentsUsed": ["Component 1", "Component 2"],
      "tags": ["IoT", "Automation", "Fun"]
    }
  ]
}

Suggest 5-8 diverse projects ranging from simple to complex.`
        },
        {
          role: "user",
          content: `Suggest projects I can build with these components: ${JSON.stringify(components)}`
        }
      ];
    } else if (action === 'get_instructions') {
      // Get detailed instructions for a specific project
      const languageInstruction = language !== 'en' 
        ? `IMPORTANT: Respond with all text content (name, overview, descriptions, tips, explanations, testing steps, troubleshooting) in ${language} language. Keep technical terms like pin names and code in English.` 
        : '';
      
      const complexityInstruction = englishLevel === 'easy' 
        ? 'CRITICAL: Use very simple words and short sentences. Explain everything as if teaching an 8-year-old child. Avoid all technical jargon - use everyday words instead. For example, say "the long leg of the LED" instead of "the anode".'
        : englishLevel === 'hard'
        ? 'Use technical terminology freely. Include detailed explanations of why each step is necessary. Reference datasheets and technical specifications where relevant. Suitable for experienced engineers and makers.'
        : 'Use clear, standard vocabulary. Explain technical terms when first used. Balance between accessibility and accuracy.';
      
      messages = [
        {
          role: "system",
          content: `You are an Arduino project instructor. Provide detailed, step-by-step instructions for building the project with visual descriptions.
${languageInstruction}
${complexityInstruction}

Return a JSON response with this exact structure:
{
  "project": {
    "name": "Project Name",
    "overview": "What this project does and why it's useful",
    "components": [
      {
        "name": "Component Name",
        "quantity": 1,
        "notes": "Any specific notes about this component"
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": "Step Title",
        "description": "Detailed description of what to do",
        "connections": [
          {
            "from": "Arduino Pin 13",
            "to": "LED Positive (long leg)",
            "wireColor": "red"
          }
        ],
        "tips": ["Helpful tip for this step"],
        "imageDescription": "Description of what the circuit should look like at this stage"
      }
    ],
    "code": {
      "filename": "project_name.ino",
      "code": "// Arduino code here",
      "explanation": "Line by line explanation of key parts of the code"
    },
    "testing": ["Step 1 to test", "Step 2 to test"],
    "troubleshooting": [
      {
        "problem": "Common problem",
        "solution": "How to fix it"
      }
    ]
  }
}

Be extremely detailed with connection instructions. Use specific pin numbers and component leg identifications.`
        },
        {
          role: "user",
          content: `Provide detailed build instructions for this project: ${projectId}. Available components: ${JSON.stringify(components)}`
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
