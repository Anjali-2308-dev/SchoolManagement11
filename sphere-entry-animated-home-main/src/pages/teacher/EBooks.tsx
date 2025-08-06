import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Upload, Download, Edit, Trash2, BookOpen } from 'lucide-react';

const EBooks = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', subject: '', class: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/ebooks');
      const data = await res.json();
      setBooks(data.data || data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('title', formData.title);
    form.append('author', formData.author);
    form.append('subject', formData.subject);
    form.append('class', formData.class);
    if (selectedFile) form.append('pdf', selectedFile);

    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit
      ? `http://localhost:5000/api/ebooks/${editId}`
      : 'http://localhost:5000/api/ebooks';

    try {
      await fetch(url, { method, body: form });
      resetForm();
      fetchBooks();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/ebooks/${id}`, { method: 'DELETE' });
      fetchBooks();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      subject: book.subject,
      class: book.class,
    });
    setEditId(book._id);
    setIsEdit(true);
    setShowAddForm(true);
  };

  const handleDownload = (book) => {
    if (book.pdfUrl) {
      const link = document.createElement('a');
      link.href = book.pdfUrl;
      link.download = `${book.title}.pdf`;
      link.click();
    } else {
      alert('No file attached.');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', subject: '', class: '' });
    setSelectedFile(null);
    setIsEdit(false);
    setEditId(null);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-teal-50 to-cyan-50">
      <style>
        {`
          @media (max-width: 640px) {
            .header-flex {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.75rem;
            }
            .action-buttons {
              flex-wrap: wrap;
              gap: 0.5rem;
            }
          }

          @media (min-width: 641px) and (max-width: 1024px) {
            .header-flex {
              flex-direction: row;
              justify-content: space-between;
            }
            .action-buttons {
              flex-wrap: nowrap;
            }
          }

          @media (min-width: 1025px) {
            .header-flex {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }
            .action-buttons {
              flex-wrap: nowrap;
            }
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto">
        <div className="header-flex flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">E-Books Library</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" /> {isEdit ? 'Edit Book' : 'Upload Book'}
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader><CardTitle>{isEdit ? 'Edit Book' : 'Upload New E-Book'}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['title', 'author', 'subject', 'class'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-2 capitalize">{field}</label>
                      <Input
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        placeholder={`Enter ${field}`}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Upload PDF File</label>
                  <div className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer">
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-600">Click or drag to upload PDF</p>
                      {selectedFile && <p className="mt-2 text-green-600 font-semibold">{selectedFile.name}</p>}
                    </label>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file?.type === 'application/pdf') setSelectedFile(file);
                        else if (file) alert('Only PDF files are allowed.');
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {isEdit ? 'Update Book' : 'Upload Book'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>E-Books Collection</CardTitle></CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1000px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Title</TableHead>
                      <TableHead className="min-w-[120px]">Author</TableHead>
                      <TableHead className="min-w-[120px]">Subject</TableHead>
                      <TableHead className="min-w-[100px]">Class</TableHead>
                      <TableHead className="min-w-[100px]">File Size</TableHead>
                      <TableHead className="min-w-[120px]">Upload Date</TableHead>
                      <TableHead className="min-w-[150px] text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-teal-600" /> {book.title}
                          </div>
                        </TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.subject}</TableCell>
                        <TableCell>{book.class}</TableCell>
                        <TableCell>{book.fileSize || '—'}</TableCell>
                        <TableCell>{book.uploadDate || '—'}</TableCell>
                        <TableCell className="text-center">
                          <div className="action-buttons flex justify-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleDownload(book)}>
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(book)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(book._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EBooks;
