import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not configured');

    const authHeader = req.headers.get('Authorization') ?? '';
    const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { workspace_id, messages } = await req.json();
    if (!workspace_id || !Array.isArray(messages)) throw new Error('workspace_id and messages required');

    // Fetch workspace context
    const { data: ws } = await userClient.from('ops_workspaces').select('name, kind').eq('id', workspace_id).maybeSingle();
    const { data: events } = await userClient
      .from('ops_events').select('title, event_type, status')
      .eq('workspace_id', workspace_id).order('created_at', { ascending: false }).limit(10);

    const systemPrompt = `You are the UPSY OPS AI Operations Director for the "${ws?.name ?? 'workspace'}" (${ws?.kind ?? 'institution'}). You orchestrate institutional operations: SOPs, accountability, psychological safety, logistics. Be direct, tactical, and operational. Use plain language. When asked to generate or modify protocols, describe what would change rather than executing — execution happens via the SOP engine.\n\nRecent operations in this workspace:\n${(events ?? []).map((e: any) => `- ${e.title} (${e.event_type}, ${e.status})`).join('\n') || '(none)'}`;

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        system: systemPrompt,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      return new Response(JSON.stringify({ error: `Claude ${claudeRes.status}: ${errText}` }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const json = await claudeRes.json();
    const reply = json.content?.find((c: any) => c.type === 'text')?.text ?? '';

    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('ops-director error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});