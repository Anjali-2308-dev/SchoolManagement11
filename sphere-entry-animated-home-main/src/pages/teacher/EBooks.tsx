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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/ebooks');
      const data = await res.json();
      setBooks(data.data || data); // adjust based on your API shape
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const res = await fetch(url, { method, body: form });
      const result = await res.json();

      setFormData({ title: '', author: '', subject: '', class: '' });
      setSelectedFile(null);
      setIsEdit(false);
      setEditId(null);
      setShowAddForm(false);
      fetchBooks();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/ebooks/${id}`, { method: 'DELETE' });
      fetchBooks();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (book: any) => {
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

  const handleDownload = (book: any) => {
    if (book.pdfUrl) {
      const link = document.createElement('a');
      link.href = book.pdfUrl;
      link.download = `${book.title}.pdf`;
      link.click();
    } else {
      alert('No file attached.');
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-teal-50 to-cyan-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">E-Books Library</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            {isEdit ? 'Edit Book' : 'Upload Book'}
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
                      <label className="block text-sm font-medium mb-2">{field}</label>
                      <Input
                        value={formData[field as keyof typeof formData]}
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
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {isEdit ? 'Update Book' : 'Upload Book'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setIsEdit(false);
                      setFormData({ title: '', author: '', subject: '', class: '' });
                      setSelectedFile(null);
                    }}
                  >
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-teal-600" />
                          {book.title}
                        </div>
                      </TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.subject}</TableCell>
                      <TableCell>{book.class}</TableCell>
                      <TableCell>{book.fileSize || '—'}</TableCell>
                      <TableCell>{book.uploadDate || '—'}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EBooks;
