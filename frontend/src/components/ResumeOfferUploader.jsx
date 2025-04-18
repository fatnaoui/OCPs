import React, { useState } from 'react';
import { Upload, FileText, Clipboard, CheckCircle, AlertCircle, FileCheck, Award, TrendingUp, Zap } from 'lucide-react';

const ResumeOfferUploader = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [inputJobDescription, setInputJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [uploadType, setUploadType] = useState('resume');
  const [activeStep, setActiveStep] = useState(1);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError(null);
      let text = '';

      if (file.name.endsWith('.pdf')) {
        text = `Simulated PDF content for: ${file.name}`;
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        text = `Simulated Word document content for: ${file.name}`;
      } else if (file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        throw new Error("Unsupported file format. Please upload PDF, DOCX, DOC, or TXT files.");
      }

      if (uploadType === 'resume') {
        setResume(file);
        setResumeText(text);
        if (activeStep === 1) {
          setActiveStep(2);
        }
      } else {
        setJobDescription(text);
        setInputJobDescription(text);
      }
    } catch (err) {
      setError(`Error processing file: ${err.message}`);
    }
  };

  const analyzeResume = () => {
    if (!resume && !resumeText) {
      setError("Please upload a resume first");
      return;
    }

    if (!jobDescription && !inputJobDescription) {
      setError("Please provide a job description");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setActiveStep(3);

    setTimeout(() => {
      try {
        const jd = jobDescription || inputJobDescription;
        
        const jdKeywords = extractKeywords(jd);
        const resumeKeywords = extractKeywords(resumeText);
        const matchScore = calculateMatchScore(jdKeywords, resumeKeywords);
        
        const analysisResult = {
          score: matchScore,
          matchedKeywords: findMatchedKeywords(jdKeywords, resumeKeywords),
          missingKeywords: findMissingKeywords(jdKeywords, resumeKeywords),
          summary: generateSummary(matchScore)
        };
        
        setResult(analysisResult);
        setIsAnalyzing(false);
      } catch (err) {
        setError(`Analysis error: ${err.message}`);
        setIsAnalyzing(false);
      }
    }, 2000);
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>
      
      <header className="relative z-10 bg-green-800 bg-opacity-90 text-white p-4 shadow-lg">
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
      
      <main className="relative z-10 flex-grow p-4 md:p-8">
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
                    Upload Your Resume
                  </h2>
                  
                  <div 
                    className="border-2 border-dashed border-green-300 rounded-2xl p-12 text-center bg-green-50 hover:bg-green-100 cursor-pointer"
                    onClick={() => {
                      setUploadType('resume');
                      document.getElementById('fileInput').click();
                    }}
                  >
                    <div className="mb-6 w-24 h-24 bg-green-200 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-800 mb-3">Drag & drop your resume here</h3>
                    <p className="text-gray-600 mb-6">or click to browse files from your computer</p>
                    <div className="inline-flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow transition-all duration-150">
                      <span>Select File</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-6">Supports PDF, DOCX, DOC, TXT</p>
                    <input 
                      type="file" 
                      id="fileInput" 
                      className="hidden" 
                      accept=".pdf,.docx,.doc,.txt" 
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  {resume && (
                    <div className="mt-6 p-4 bg-green-100 rounded-xl flex items-center border border-green-200 shadow">
                      <div className="bg-green-200 p-2 rounded-full mr-3">
                        <FileCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-green-800">Resume Uploaded Successfully</h4>
                        <p className="text-green-700 text-sm">{resume.name}</p>
                      </div>
                      <button 
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        onClick={() => setActiveStep(2)}
                      >
                        Continue
                      </button>
                    </div>
                  )}
                  
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
                    Enter Job Description
                  </h2>
                  
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <textarea
                      className="w-full h-64 p-4 border-2 border-green-200 rounded-xl"
                      value={inputJobDescription}
                      onChange={(e) => setInputJobDescription(e.target.value)}
                      placeholder="Paste job description here..."
                    />
                    
                    <div className="mt-4 text-center">
                      <p className="text-gray-600 mb-3">or upload a job description file</p>
                      <button
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-full font-medium"
                        onClick={() => {
                          setUploadType('job');
                          document.getElementById('jobFileInput').click();
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        <span>Upload File</span>
                      </button>
                      <input 
                        type="file" 
                        id="jobFileInput" 
                        className="hidden" 
                        accept=".pdf,.docx,.doc,.txt" 
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <button 
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center"
                      onClick={() => setActiveStep(1)}
                    >
                      Back
                    </button>
                    
                    <button 
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium shadow-lg flex items-center"
                      onClick={analyzeResume}
                      disabled={isAnalyzing || (!jobDescription && !inputJobDescription)}
                    >
                      {isAnalyzing ? "Analyzing..." : "Match Resume"}
                    </button>
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
                  ) : result ? (
                    <div className="mt-4">
                      <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl overflow-hidden shadow-lg mb-8">
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
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md">
                          <div className="bg-green-50 p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-green-800 flex items-center">
                              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                              Matched Skills
                            </h3>
                          </div>
                          <div className="p-6">
                            {result.matchedKeywords.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {result.matchedKeywords.map((keyword, index) => (
                                  <div key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1.5 rounded-full flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    {keyword}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                                No matching keywords found
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md">
                          <div className="bg-red-50 p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-red-800 flex items-center">
                              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                              Missing Skills
                            </h3>
                          </div>
                          <div className="p-6">
                            {result.missingKeywords.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {result.missingKeywords.slice(0, 15).map((keyword, index) => (
                                  <div key={index} className="bg-red-100 text-red-800 text-sm px-3 py-1.5 rounded-full flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    {keyword}
                                  </div>
                                ))}
                                {result.missingKeywords.length > 15 && (
                                  <span className="text-gray-500 text-sm italic py-1">
                                    +{result.missingKeywords.length - 15} more
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-green-600 font-medium flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Perfect match! No missing keywords!
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-xl p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Smart Recommendations
                        </h3>
                        
                        <div className="space-y-4">
                          {result.score < 70 && (
                            <div className="flex items-start bg-white p-3 rounded-lg">
                              <div className="bg-yellow-100 rounded-full p-1 mr-3">
                                <Zap className="w-5 h-5 text-yellow-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">Highlight These Skills</h4>
                                <p className="text-gray-600">Add or emphasize experience with: {result.missingKeywords.slice(0, 5).join(', ')}</p>
                              </div>
                            </div>
                          )}
                          
                          {result.matchedKeywords.length > 0 && (
                            <div className="flex items-start bg-white p-3 rounded-lg">
                              <div className="bg-green-100 rounded-full p-1 mr-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">Strengths to Emphasize</h4>
                                <p className="text-gray-600">Your strong skills: {result.matchedKeywords.slice(0, 5).join(', ')}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-start bg-white p-3 rounded-lg">
                            <div className={`rounded-full p-1 mr-3 ${
                              result.score >= 80 ? 'bg-green-100' : 
                              result.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              <Award className={`w-5 h-5 ${
                                result.score >= 80 ? 'text-green-600' : 
                                result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">Overall Assessment</h4>
                              <p className="text-gray-600">
                                {result.score >= 80 
                                  ? "This candidate is an excellent match for the position. Consider moving forward with an interview."
                                  : result.score >= 60
                                    ? "This candidate has potential but may need additional screening to verify key qualifications."
                                    : "This candidate may not be the best fit. Consider looking for candidates with more relevant experience."
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex items-center justify-between">
  {/* Footer Polish */}
                        <button 
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-semibold shadow"
                          onClick={() => setActiveStep(2)}
                        >
                          Back
                        </button>
                        
                        <button 
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow-lg"
                          onClick={() => window.print()}
                        >
                          Export Report
                        </button>
                      </div>
                    </div>
                  ) : null}
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
  );
};

export default ResumeOfferUploader;
