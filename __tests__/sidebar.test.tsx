import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NextIntlClientProvider } from 'next-intl'
import Sidebar from '@/components/sidebar'

// Mock messages for testing
const messages = {
  sidebar: {
    title: 'Pilot Phase',
    subtitle: 'Digital Mother-Child Record',
    nav: {
      home: 'Home',
      supervision: 'Supervision',
      application: 'Application',
      comparison: 'Comparison',
    },
    refreshButton: 'Refresh Data',
    refreshing: 'Refreshing...',
    footer: 'Côte d\'Ivoire 2026',
  },
}

describe('Sidebar Component', () => {
  it('renders sidebar title', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Sidebar />
      </NextIntlClientProvider>
    )
    
    expect(screen.getByText('Pilot Phase')).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Sidebar />
      </NextIntlClientProvider>
    )
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Supervision')).toBeInTheDocument()
    expect(screen.getByText('Application')).toBeInTheDocument()
    expect(screen.getByText('Comparison')).toBeInTheDocument()
  })

  it('renders refresh button', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Sidebar />
      </NextIntlClientProvider>
    )
    
    expect(screen.getByText('Refresh Data')).toBeInTheDocument()
  })
})
