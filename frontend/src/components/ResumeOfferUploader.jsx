import React, { useState, useRef } from 'react';
import api from '../api';
import { Upload, FileText, Clipboard, CheckCircle, AlertCircle, FileCheck, Award, TrendingUp, Zap } from 'lucide-react';

const ResumeOfferUploader = () => {
  const [offerFile, setOfferFile] = useState(null);
  const [cvFiles, setCvFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [offerDescription, setOfferDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const jobFileInputRef = useRef(null);
  const cvFileInputRef = useRef(null);

  // Handle offer file input
  const handleOfferChange = (e) => {
    setOfferFile(e.target.files[0]);
  };

  // Handle CV files input
  const handleCvChange = (e) => {
    setCvFiles(Array.from(e.target.files));
  };

  // Handle submit: upload offer and CVs, then fetch scores
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setScores([]);
    if (!offerFile || cvFiles.length === 0) {
      setError('Please select a job offer and at least one resume.');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('offer', offerFile);
      cvFiles.forEach((file) => {
        formData.append('cvs', file);
      });
      await api.post('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // After upload, fetch scores
      const response = await api.get('/scores');
      setScores(response.data);
    } catch (err) {
      setError('Error uploading or fetching scores: ' + (err.response?.data?.detail || err.message));
    }
    setIsLoading(false);
  };


  const extractKeywords = (text) => {
    if (!text) return [];
    
    const words = text.toLowerCase().split(/\W+/);
    const filteredWords = words.filter(word => 
      word.length > 3 && !commonWords.includes(word)
    );
    
    const wordCounts = {};
    filteredWords.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    return Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
  };

  const calculateMatchScore = (jdKeywords, resumeKeywords) => {
    if (!jdKeywords.length) return 0;
    
    const jdWords = jdKeywords.map(k => k.word);
    const resumeWords = resumeKeywords.map(k => k.word);
    
    let matchCount = 0;
    jdWords.forEach(word => {
      if (resumeWords.includes(word)) {
        matchCount++;
      }
    });
    
    return Math.round((matchCount / jdWords.length) * 100);
  };

  const findMatchedKeywords = (jdKeywords, resumeKeywords) => {
    const jdWords = jdKeywords.map(k => k.word);
    const resumeWords = resumeKeywords.map(k => k.word);
    
    return jdWords.filter(word => resumeWords.includes(word));
  };

  const findMissingKeywords = (jdKeywords, resumeKeywords) => {
    const jdWords = jdKeywords.map(k => k.word);
    const resumeWords = resumeKeywords.map(k => k.word);
    
    return jdWords.filter(word => !resumeWords.includes(word));
  };

  const generateSummary = (score) => {
    if (score >= 80) {
      return "Strong match! This candidate's resume aligns exceptionally well with the job requirements.";
    } else if (score >= 60) {
      return "Good match. The candidate meets many of the job requirements but may lack some key qualifications.";
    } else if (score >= 40) {
      return "Moderate match. The candidate has some relevant qualifications but is missing several key requirements.";
    } else {
      return "Low match. This candidate's qualifications don't align well with the job requirements.";
    }
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-green-400 to-green-600";
    if (score >= 60) return "from-green-300 to-green-500";
    if (score >= 40) return "from-yellow-300 to-yellow-500";
    return "from-red-300 to-red-500";
  };

  const getScoreEmoji = (score) => {
    if (score >= 80) return "🔥";
    if (score >= 60) return "👍";
    if (score >= 40) return "🤔";
    return "👎";
  };

  const commonWords = [
    "the", "and", "that", "have", "for", "not", "with", "you", "this", "but",
    "his", "from", "they", "will", "would", "there", "their", "what", "about",
    "which", "when", "your", "said", "could", "were", "them", "some", "into"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-200 via-green-400 to-green-600 font-sans">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>
      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="bg-green-800 bg-opacity-90 text-white p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1.5 rounded-lg">
                <FileCheck className="w-7 h-7 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold">TalentMatch</h1>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-700">Smart Screening</div>
              <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-700">AI-Powered</div>
              <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-700">Fast Results</div>
            </div>
          </div>
        </header>
        <main className="flex-grow p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              {/* Stepper Polish */}
              <div className="flex justify-between items-center bg-white bg-opacity-30 p-4 rounded-full backdrop-blur shadow-lg">
                <div className={`flex items-center justify-center rounded-full w-12 h-12 text-lg font-bold shadow ${activeStep === 1 ? 'bg-green-500 text-white' : (activeStep > 1 ? 'bg-green-700 text-white' : 'bg-white bg-opacity-40 text-green-900')}`}>
                  {activeStep > 1 ? <CheckCircle className="w-5 h-5" /> : 1}
                </div>
                <div className={`h-1 flex-grow mx-2 ${activeStep > 1 ? 'bg-green-500' : 'bg-white bg-opacity-20'}`}></div>
                <div className={`flex items-center justify-center rounded-full w-12 h-12 text-lg font-bold shadow ${activeStep === 2 ? 'bg-green-500 text-white' : (activeStep > 2 ? 'bg-green-700 text-white' : 'bg-white bg-opacity-40 text-green-900')}`}>
                  {activeStep > 2 ? <CheckCircle className="w-5 h-5" /> : 2}
                </div>
                <div className={`h-1 flex-grow mx-2 ${activeStep > 2 ? 'bg-green-500' : 'bg-white bg-opacity-20'}`}></div>
                <div className={`flex items-center justify-center rounded-full w-12 h-12 text-lg font-bold shadow ${activeStep === 3 ? 'bg-green-500 text-white' : 'bg-white bg-opacity-40 text-green-900'}`}>
                  3
                </div>
              </div>
              <div className="flex justify-between text-green-900 text-xs mt-2 px-2 font-semibold">
                <span className={activeStep >= 1 ? 'font-medium' : 'opacity-70'}>Upload Resume</span>
                <span className={activeStep >= 2 ? 'font-medium' : 'opacity-70'}>Job Description</span>
                <span className={activeStep >= 3 ? 'font-medium' : 'opacity-70'}>Results</span>
              </div>
            </div>

          <div className="bg-red-500 rounded-2xl shadow-2xl border border-green-100 overflow-hidden">
            <div className="p-6">
              {activeStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center">
                    <FileText className="w-6 h-6 mr-2" />
                    Upload Resumes
                  </h2>
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <div
                      className="border-2 border-dashed border-green-300 rounded-2xl p-12 text-center bg-green-50 hover:bg-green-100 cursor-pointer"
                      onClick={() => {
                        if (cvFileInputRef.current) cvFileInputRef.current.click();
                      }}
                    >
                      <div className="mb-6 w-24 h-24 bg-green-200 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-12 h-12 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-800 mb-3">Drag & drop, click, or select a folder to upload resumes</h3>
                      <p className="text-gray-600 mb-6">Supports PDF, DOCX</p>
                      <input
                        type="file"
                        ref={cvFileInputRef}
                        className="hidden"
                        accept=".pdf,.docx"
                        multiple
                        webkitdirectory="true"
                        directory="true"
                        onChange={handleCvChange}
                      />
                      {cvFiles.length > 0 && (
                        <div className="mt-6 p-4 bg-green-100 rounded-xl flex items-center border border-green-200 shadow">
                          <div className="bg-green-200 p-2 rounded-full mr-3">
                            <FileCheck className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-green-800">Resumes Uploaded</h4>
                            <ul className="text-green-700 text-sm">
                              {cvFiles.map((file, idx) => (
                                <li key={idx}>{file.name}</li>
                              ))}
                            </ul>
                          </div>
                          <button
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveStep(2);
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {error && (
                    <div className="mt-6 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              )}
              {activeStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center">
                    <Clipboard className="w-6 h-6 mr-2" />
                    Upload Job Description
                  </h2>
                  <div 
                    className="border-2 border-dashed border-green-300 rounded-2xl p-12 text-center bg-green-50 hover:bg-green-100 cursor-pointer"
                    onClick={() => {
                      if (jobFileInputRef.current) jobFileInputRef.current.click();
                    }}
                  >
                    <div className="mb-6 w-24 h-24 bg-green-200 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-800 mb-3">Drag & drop or click to upload job description file</h3>
                    <p className="text-gray-600 mb-6">Supports PDF, DOCX</p>
                    <input
                      type="file"
                      ref={jobFileInputRef}
                      className="hidden"
                      accept=".pdf,.docx"
                      onChange={handleOfferChange}
                    />
                    {offerFile && (
                      <div className="mt-6 p-4 bg-green-100 rounded-xl flex items-center border border-green-200 shadow">
                        <div className="bg-green-200 p-2 rounded-full mr-3">
                          <FileCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-green-800">Job Description Uploaded</h4>
                          <p className="text-green-700 text-sm">{offerFile.name}</p>
                        </div>
                        <button 
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                          onClick={e => {
                            e.stopPropagation();
                            setActiveStep(3);
                          }}
                        >
                          Continue
                        </button>
                      </div>
                    )}
                  </div>
                  {error && (
                    <div className="mt-6 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              )}
              {activeStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-green-800 flex items-center">
                    <Award className="w-6 h-6 mr-2" />
                    Screening Results
                  </h2>
                  
                  {isAnalyzing ? (
                    <div className="py-16 text-center">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-green-100 border-t-green-600 animate-spin"></div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">Analyzing Resume</h3>
                      <p className="text-gray-600">Please wait while we match the resume with the job description...</p>
                    </div>
                  ) : Array.isArray(scores) && scores.length > 0 ? (
                    <div className="mt-4">
                      {/* Render scores results here, e.g. map over scores */}
                  {scores.map((result, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl overflow-hidden shadow-lg mb-8">
                          <div className="p-6 text-white">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium opacity-90">Match Score</h3>
                              <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
                                Candidate Report
                              </div>
                            </div>
                            <div className="mt-6 flex items-center">
                              <div className="relative">
                                <div className="w-32 h-32 rounded-full flex items-center justify-center bg-white bg-opacity-10">
                                  <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${getScoreGradient(result.score)} flex items-center justify-center text-white font-bold text-3xl`}>
                                    {result.score}%
                                  </div>
                                </div>
                                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl">
                                  {getScoreEmoji(result.score)}
                                </div>
                              </div>
                              <div className="ml-6 flex-grow">
                                <h4 className="text-xl font-bold mb-2">{result.summary}</h4>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                  <div className="bg-white bg-opacity-10 p-2 rounded flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{result.matchedKeywords.length} Skills Matched</span>
                                  </div>
                                  <div className="bg-white bg-opacity-10 p-2 rounded flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{result.missingKeywords.length} Skills Missing</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* ...rest of the result rendering ... */}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center">
                      <h3 className="text-xl font-semibold text-green-800 mb-2">No results to display</h3>
                      <p className="text-gray-600">Please upload a resume and job description, then click Continue to see the analysis results.</p>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
        <footer className="mt-8 text-center text-white text-sm opacity-70">
          <p>TalentMatch Resume Screening Tool &copy; 2025 | AI-Powered Resume Analysis</p>
        </footer>
      </div>
    </main>
  </div>
</div>
  );
};

export default ResumeOfferUploader;