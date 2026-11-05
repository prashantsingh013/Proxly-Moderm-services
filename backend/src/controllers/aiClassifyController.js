import { classifyIssue } from '../services/aiClassifierEngine.js';

export const classifyProblemDescription = async (req, res) => {
  try {
    const { problemText } = req.body;

    if (!problemText || typeof problemText !== 'string') {
      return res.status(400).json({ success: false, message: 'Problem description text is required' });
    }

    const classification = await classifyIssue(problemText);

    return res.status(200).json({
      success: true,
      query: problemText,
      classification
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Classification failed', error: error.message });
  }
};
