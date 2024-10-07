import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { faqCategoryMapping } from '../constants';
import { Button } from '@/components/ui/button';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  category: string;
  faqs: FaqItem[];
}

const FaqCategory: React.FC<{ category: FaqCategory }> = ({ category }) => {
  return (
    <Card className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-xl font-bold text-green-600">
          {faqCategoryMapping[category.category] || category.category}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 text-left">
        {category.faqs.map((faq, index) => (
          <FaqItem key={index} faq={faq} />
        ))}
      </CardContent>
    </Card>
  );
};

const FaqItem: React.FC<{ faq: FaqItem }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
      <Button
        variant="ghost"
        className="flex justify-between items-center w-full text-left font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-800">{faq.question}</span>
        <ArrowDropDownIcon 
          className={`w-6 h-6 text-green-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </Button>
      {isOpen && (
        <div className="mt-2 pl-4 pr-8 py-2 text-gray-600 animate-fadeIn">
          {faq.answer}
        </div>
      )}
    </div>
  );
};

export const Faq: React.FC = () => {
  const [faqData, setFaqData] = useState<FaqCategory[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('/api/faq/user');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const faqs = await response.json();
        
        // Organize FAQs by category
        const organizedFaqs = faqs.reduce((acc: FaqCategory[], faq: any) => {
          const categoryKey = faq.category.toUpperCase();
          const existingCategory = acc.find(c => c.category === categoryKey);
          if (existingCategory) {
            existingCategory.faqs.push({ question: faq.question, answer: faq.answer });
          } else {
            acc.push({ category: categoryKey, faqs: [{ question: faq.question, answer: faq.answer }] });
          }
          return acc;
        }, []);

        // Sort categories based on the order in faqCategoryMapping
        const sortedFaqs = organizedFaqs.sort((a, b) => {
          const orderA = Object.keys(faqCategoryMapping).indexOf(a.category);
          const orderB = Object.keys(faqCategoryMapping).indexOf(b.category);
          return orderA - orderB;
        });

        setFaqData(sortedFaqs);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className="wrapper max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Frequently Asked Questions</h1>
      {faqData.map((category, index) => (
        <FaqCategory key={index} category={category} />
      ))}
    </div>
  );
};