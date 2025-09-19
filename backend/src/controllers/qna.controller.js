const QnA = require('../models/qna.model');

exports.create = async (req, res) => {
  try {
    const { question, answer, lectureId, tags } = req.body;
    const q = new QnA({ question, answer, askedBy: req.user.id, lecture: lectureId, tags });
    await q.save();
    res.json(q);
  } catch (err) { console.error('qna create err', err); res.status(500).json({ msg: 'Server error' }); }
};

exports.search = async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) return res.json([]);
    const results = await QnA.find({ $text: { $search: q } }).limit(50);
    res.json(results);
  } catch (err) { console.error('qna search err', err); res.status(500).json({ msg: 'Server error' }); }
};
