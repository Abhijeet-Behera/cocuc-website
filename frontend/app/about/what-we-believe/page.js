import PageHeader from '@/components/PageHeader'
import styles from './what-we-believe.module.css'

export default function WhatWeBelievePage() {
  const beliefs = [
    {
      statement: "We believe the Bible to be the inspired, the only infallible, authoritative Word of God.",
      scriptures: "(1 Thessalonians 2:13; 2 Timothy 3:15-17)"
    },
    {
      statement: "We believe that there is one God, eternally existent in three persons: Father, Son, and Holy Spirit.",
      scriptures: "(Matthew 28:19; John 10:30; Ephesians 4:4-6)"
    },
    {
      statement: "We believe in the deity of the Lord Jesus Christ, in His virgin birth, in His sinless life, in His miracles, in His vicarious and atoning death through His shed blood on the cross, in His bodily resurrection, in His ascension to the right hand of the Father, and in His personal return in power and glory.",
      scriptures: "(Matthew 1:23; John 1:1-4 and 1:29; Acts 1:11 and 2:22-24; Romans 8:34; 1 Corinthians 15:3-4; 2 Corinthians 5:21; Philippians 2:5-11; Hebrews 1:1-4 and 4:15)"
    },
    {
      statement: "We believe that all men everywhere are lost and face the judgment of God, that Jesus Christ is the only way of salvation, and that for the salvation of lost and sinful man, repentance of sin and faith in Jesus Christ results in regeneration by the Holy Spirit.",
      scriptures: "(Luke 24:46-47; John 14:6; Acts 4:12; Romans 3:23; 2 Corinthians 5:10-11; Ephesians 1:7 and 2:8-9; Titus 3:4-7)"
    },
    {
      statement: "We believe in the ministry of the Holy Spirit, whose indwelling enables the Christian to live a godly life.",
      scriptures: "(John 3:5-8; Acts 1:8, 4:31; Romans 8:9; 1 Corinthians 2:14; Galatians 5:16-18; Ephesians 6:12; Colossians 2:6-10)"
    },
    {
      statement: "We believe in the resurrection of both the saved and the lost; the saved unto the resurrection of eternal life and the lost unto the resurrection of damnation and eternal punishment.",
      scriptures: "(1 Corinthians 15:51-57; Revelation 20:11-15)"
    },
    {
      statement: "We believe in the spiritual unity of believers in the Lord Jesus Christ and that all true believers are members of His body, the Church.",
      scriptures: "(1 Corinthians 12:12, 27; Ephesians 1:22-23)"
    },
    {
      statement: "We believe that the ministry of evangelism and discipleship is a responsibility of all followers of Jesus Christ.",
      scriptures: "(Matthew 28:18-20; Acts 1:8; Romans 10:9-15; 1 Peter 3:15)"
    },
    {
      statement: "We believe that we must dedicate ourselves to prayer, to the service of our Lord, to His authority over our lives, and to the ministry of evangelism.",
      scriptures: "(Matthew 9:35-38; 22:37-39, and 28:18-20; Acts 1:8; Romans 10:9-15 and 12:20-21; Galatians 6:10; Colossians 2:6-10; 1 Peter 3:15)"
    },
    {
      statement: "We believe that human life is sacred from conception to its natural end; and that we must have concern for the physical and spiritual needs of our fellowmen.",
      scriptures: "(Psalm 139:13; Isaiah 49:1; Jeremiah 1:5; Matthew 22:37-39; Romans 12:20-21; Galatians 6:10)"
    }
  ];

  return (
    <div>
      <PageHeader
        category="About"
        title="What We Believe"
        description="The core tenets of our faith and foundational doctrines."
      />


      <section className="section container">
        <div className={styles.cardContainer}>
          
          <div className={styles.beliefsList}>
            {beliefs.map((belief, index) => (
              <div key={index} className={styles.beliefRow}>
                <p className={styles.beliefText}>
                  {belief.statement}
                </p>
                <p className={styles.beliefScripture}>
                  {belief.scriptures}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
