// pages/api/jira/boards/[boardId]/sprints.ts - Fetch sprints for a board

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { boardId } = req.query;

  if (!boardId || Array.isArray(boardId)) {
    return res.status(400).json({ error: 'Invalid board ID' });
  }

  try {
    const auth = Buffer.from(
      `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
    ).toString('base64');

    const response = await axios.get(
      `${process.env.JIRA_BASE_URL}/rest/agile/1.0/board/${boardId}/sprint`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        params: {
          maxResults: 50,
        },
      }
    );

    // Cache for 30 minutes
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(`JIRA API Error (sprints for board ${boardId}):`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch sprints',
      details: error.response?.data || error.message,
    });
  }
}
