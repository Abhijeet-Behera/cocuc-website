export default function LeadershipPage() {
  return (
    <div>
      <section style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', padding: '150px 0 100px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Leadership Team</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Meet the dedicated individuals serving our congregation.
          </p>
        </div>
      </section>

      <section className="section container">
        <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'var(--color-white)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Pastoral Team */}
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                Pastoral Team
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                <li><strong>Rev. Dr. Ayub Chhinchani</strong>, Pastor <em>(9437418423)</em></li>
                <li><strong>Rev. Songram Keshari Singh</strong>, Pastor <em>(9437284415)</em></li>
                <li><strong>Rev. Satish Kumar Pani</strong>, Pastor <em>(9438518776)</em></li>
              </ul>
            </div>

            {/* Church Board */}
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                Church Board (2026-29)
              </h2>
              <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                The selection was held on 21 & 23rd January, 2026, by the five-member Supervisory Committee of the Church.
              </p>
              
              <h3 style={{ fontSize: '1.4rem', color: 'var(--color-text)', marginBottom: '1rem' }}>DEACONS & DEACONESSES</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', fontSize: '1.05rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
                  <li>1. Mr. Michael Rajesh Behera <strong>(Secretary)</strong></li>
                  <li>2. Mr. Smruti Ranjan Nayak <strong>(Joint secretary)</strong></li>
                  <li>3. Mr. Suranjan Thomas <strong>(Treasurer)</strong></li>
                  <li>4. Mr. Adit Jena</li>
                  <li>5. Mr. Amrut Kumar Jena</li>
                  <li>6. Mr. Benjamin Peter</li>
                  <li>7. Mr. Bipra Charan Digal</li>
                  <li>8. Mr. Gokula Chandra Pradhan</li>
                  <li>9. Mr. Manas Ranjan Behera</li>
                </ul>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
                  <li>10. Mr. Prafulla Kumar Dash</li>
                  <li>11. Mr. Pravat Kumar Chand</li>
                  <li>12. Mr. Rajsekhar Sahu</li>
                  <li>13. Mr. Ranjan Gan</li>
                  <li>14. Mr. Santosh Kumar Nayak</li>
                  <li>15. Mr. Satya Ranjan Singh</li>
                  <li>16. Mr. Sudhir Kumar Swain</li>
                  <li>17. Ms. Swarnamayee Patra <strong>(Deaconess)</strong></li>
                  <li>18. Ms. Madhuleeta Samantaray <strong>(Deaconess)</strong></li>
                </ul>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', marginTop: '2rem', marginBottom: '0.5rem' }}>Stand-by</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.05rem', lineHeight: 1.8 }}>
                <li>Mr. Samir Kumar Patro</li>
                <li>Prof. Anup Kumar Samantaray</li>
                <li>Ms. Madhusmita Rout <strong>(Deaconess)</strong></li>
              </ul>
            </div>

            {/* Sunday School & CE Union */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                  Sunday School
                </h2>
                <p style={{ fontSize: '1.1rem' }}><strong>Superintendent:</strong> Mr. Asim Das</p>
              </div>

              <div>
                <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                  Mahila Samiti (Maa Sabha)
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <li><strong>President:</strong> Mrs. Manoharini Muduli</li>
                  <li><strong>Secretary:</strong> Mrs. Tarangini Pradhan</li>
                  <li><strong>Asst. Secretary:</strong> Mrs. Itishree Das</li>
                  <li><strong>Treasurer:</strong> Mrs. Elizabeth Moharana</li>
                </ul>
              </div>
            </div>

            {/* CE Union */}
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                Christian Endeavour Union (CE)
              </h2>
              <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Newly elected CE board members for the year 2026 to 2028:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', fontSize: '1.05rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
                  <li><strong>President:</strong> Dr Purnananda Pradhan</li>
                  <li><strong>Vice President:</strong> Santanu Kumar Rout</li>
                  <li><strong>Secretary:</strong> Rev Amos Pradhan</li>
                  <li><strong>Asst Secy:</strong> Samuel K Pradhan</li>
                  <li><strong>Treasurer:</strong> Benjamin Chouhan</li>
                  <li><strong>Lookout Com Secy:</strong> Smrutirekha Pradhan</li>
                  <li><strong>Lookout Asst Secy:</strong> Kalpita Pradhan</li>
                  <li><strong>Social Com Secy:</strong> Kabita Das</li>
                  <li><strong>Social Com Secy:</strong> Sudipta Pradhan</li>
                  <li><strong>Boithak Secy:</strong> John Augustin Nayak</li>
                </ul>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
                  <li><strong>Programme Com Secy:</strong> Sujoy kumar</li>
                  <li><strong>Auditor:</strong> Ratan Dash</li>
                  <li><strong>Adviser:</strong> Rev Songram K. Singh</li>
                  <li><strong>Adviser:</strong> Rev. Dr. Ayub Chhinchani</li>
                  <li><strong>Adviser:</strong> Rev. Satish Kumar Pani</li>
                  <li><strong>Adviser:</strong> Joachim Manas Ranjan</li>
                  <li><strong>Adviser:</strong> Asit Kumar Mohanty</li>
                  <li><strong>Adviser:</strong> Asish Das</li>
                  <li><strong>Adviser:</strong> Ranjan Kumar Nayak</li>
                </ul>
              </div>
            </div>

            {/* Other Staff */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                  Evangelists
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <li>Evg. Pratap Kumar Sahoo</li>
                  <li>Evg. Ranjit Singh</li>
                  <li>Evg. Gobinda Sahoo</li>
                  <li>Evg. Sujit Bishoi</li>
                  <li>Evg. Christopher Surya</li>
                </ul>
              </div>
              
              <div>
                <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                  Support Staff
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <li><strong>Caretaker:</strong> Mr. Sobhajan Pradhan</li>
                  <li><strong>Assistant Caretaker:</strong> Mr. Krushna Chandra Digal</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
