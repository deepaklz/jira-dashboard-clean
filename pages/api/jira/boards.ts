// pages/api/jira/boards.ts - Fetch all boards

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = Buffer.from(
      `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
    ).toString('base64');

    const response = await axios.get(
      `${process.env.JIRA_BASE_URL}/rest/agile/1.0/board`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        params: {
          maxResults: 100,
        },
      }
    );

    // Cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('JIRA API Error (boards):', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch boards',
      details: error.response?.data || error.message,
    });
  }
}
