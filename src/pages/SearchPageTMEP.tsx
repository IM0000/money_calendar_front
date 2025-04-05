import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import SearchInput from '../components/Search2/SearchInput';
import EconomicResults from '../components/Search2/EconomicResults';
import { EconomicResult } from '../components/Search2/EconomicResultItem';
import { CompanyResult } from '../components/Search2/CompanyResultItem';
import { CompanyResults } from '../components/Search2/CompanyResults';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [economicResults, setEconomicResults] = useState<EconomicResult[]>([]);
  const [companyResults, setCompanyResults] = useState<CompanyResult[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchSearchResults();
  };

  useEffect(() => {
    fetchSearchResults();
  }, []);

  const fetchSearchResults = () => {
    const economic: EconomicResult[] = [
      {
        country: '영국',
        importance: 3,
        eventName: '월간 영국 국내총생산(GDP)',
        isAdded: true,
      },
      {
        country: '호주',
        importance: 2,
        eventName: '호주 국내총생산(GDP) <전분기 대비>',
        isAdded: false,
      },
      {
        country: '영국',
        importance: 3,
        eventName: '월간 영국 국내총생산(GDP)',
        isAdded: true,
      },
      {
        country: '호주',
        importance: 2,
        eventName: '호주 국내총생산(GDP) <전분기 대비>',
        isAdded: false,
      },
      {
        country: '영국',
        importance: 3,
        eventName: '월간 영국 국내총생산(GDP)',
        isAdded: true,
      },
      {
        country: '호주',
        importance: 2,
        eventName: '호주 국내총생산(GDP) <전분기 대비>',
        isAdded: false,
      },
      {
        country: '영국',
        importance: 3,
        eventName: '월간 영국 국내총생산(GDP)',
        isAdded: true,
      },
      {
        country: '호주',
        importance: 2,
        eventName: '호주 국내총생산(GDP) <전분기 대비>',
        isAdded: false,
      },
      {
        country: '영국',
        importance: 3,
        eventName: '월간 영국 국내총생산(GDP)',
        isAdded: true,
      },
      {
        country: '호주',
        importance: 2,
        eventName: '호주 국내총생산(GDP) <전분기 대비>',
        isAdded: false,
      },
      {
        country: '영국',
        importance: 3,
        eventName: '월간 영국 국내총생산(GDP)',
        isAdded: true,
      },
      {
        country: '호주',
        importance: 2,
        eventName: '호주 국내총생산(GDP) <전분기 대비>',
        isAdded: false,
      },
      {
        country: '영국',
        importance: 3,
        eventName: '월간 영국 국내총생산(GDP)',
        isAdded: true,
      },
      {
        country: '호주',
        importance: 2,
        eventName: '호주 국내총생산(GDP) <전분기 대비>',
        isAdded: false,
      },
      {
        country: '영국',
        importance: 3,
        eventName: '월간 영국 국내총생산(GDP)',
        isAdded: true,
      },
      {
        country: '호주',
        importance: 2,
        eventName: '호주 국내총생산(GDP) <전분기 대비>',
        isAdded: false,
      },
      {
        country: '영국',
        importance: 3,
        eventName: '월간 영국 국내총생산(GDP)',
        isAdded: true,
      },
      {
        country: '호주',
        importance: 2,
        eventName: '호주 국내총생산(GDP) <전분기 대비>',
        isAdded: false,
      },
      {
        country: '영국',
        importance: 3,
        eventName: '월간 영국 국내총생산(GDP)',
        isAdded: true,
      },
      {
        country: '호주',
        importance: 2,
        eventName: '호주 국내총생산(GDP) <전분기 대비>',
        isAdded: false,
      },
    ];

    const companies: CompanyResult[] = [
      {
        ticker: 'AAPL',
        name: 'Apple Inc.',
        isDividendAdded: true,
        isPerformanceAdded: false,
      },
      {
        ticker: 'MSFT',
        name: 'Microsoft Corp.',
        isDividendAdded: false,
        isPerformanceAdded: true,
      },
    ];

    setEconomicResults(economic);
    setCompanyResults(companies);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
        <div className="flex space-x-4">
          <EconomicResults results={economicResults} />
          <CompanyResults results={companyResults} />
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
