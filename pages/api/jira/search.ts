// pages/api/jira/search.ts - JQL search endpoint

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jql, maxResults = 100, fields = [] } = req.body;

  if (!jql) {
    return res.status(400).json({ error: 'JQL query is required' });
  }

  try {
    const auth = Buffer.from(
      `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
    ).toString('base64');

    const response = await axios.post(
      `${process.env.JIRA_BASE_URL}/rest/api/3/search`,
      {
        jql,
        maxResults,
        fields,
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Cache for 10 minutes (sprint data changes frequently)
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('JIRA API Error (search):', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to execute JQL search',
      details: error.response?.data || error.message,
    });
  }
}
