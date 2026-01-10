<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">

    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>Карта сайта - Asia Taren</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                <style type="text/css">
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 20px;
                        min-height: 100vh;
                    }
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        overflow: hidden;
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 40px;
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 42px;
                        margin-bottom: 10px;
                        font-weight: 700;
                    }
                    .header p {
                        font-size: 18px;
                        opacity: 0.9;
                    }
                    .stats {
                        display: flex;
                        justify-content: center;
                        gap: 30px;
                        margin-top: 30px;
                        flex-wrap: wrap;
                    }
                    .stat {
                        background: rgba(255,255,255,0.2);
                        padding: 15px 30px;
                        border-radius: 15px;
                        backdrop-filter: blur(10px);
                    }
                    .stat-number {
                        font-size: 32px;
                        font-weight: bold;
                        display: block;
                    }
                    .stat-label {
                        font-size: 14px;
                        opacity: 0.9;
                    }
                    .content {
                        padding: 40px;
                    }
                    .info-box {
                        background: #f8f9fa;
                        border-left: 4px solid #667eea;
                        padding: 20px;
                        margin-bottom: 30px;
                        border-radius: 8px;
                    }
                    .info-box h3 {
                        color: #667eea;
                        margin-bottom: 10px;
                        font-size: 18px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    thead {
                        background: #f8f9fa;
                        position: sticky;
                        top: 0;
                    }
                    th {
                        padding: 15px;
                        text-align: left;
                        font-weight: 600;
                        color: #495057;
                        border-bottom: 2px solid #dee2e6;
                    }
                    td {
                        padding: 15px;
                        border-bottom: 1px solid #f1f3f5;
                    }
                    tbody tr:hover {
                        background: #f8f9fa;
                        transition: all 0.2s;
                    }
                    .url-link {
                        color: #667eea;
                        text-decoration: none;
                        font-weight: 500;
                        word-break: break-all;
                    }
                    .url-link:hover {
                        color: #764ba2;
                        text-decoration: underline;
                    }
                    .priority {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                    }
                    .priority-high {
                        background: #d4edda;
                        color: #155724;
                    }
                    .priority-medium {
                        background: #fff3cd;
                        color: #856404;
                    }
                    .priority-low {
                        background: #f8d7da;
                        color: #721c24;
                    }
                    .change-freq {
                        color: #6c757d;
                        font-size: 14px;
                    }
                    .date {
                        color: #6c757d;
                        font-size: 14px;
                    }
                    .footer {
                        background: #f8f9fa;
                        padding: 30px;
                        text-align: center;
                        color: #6c757d;
                        border-top: 1px solid #dee2e6;
                    }
                    @media (max-width: 768px) {
                        .header h1 {
                            font-size: 28px;
                        }
                        .stats {
                            gap: 15px;
                        }
                        .content {
                            padding: 20px;
                        }
                        table {
                            font-size: 14px;
                        }
                        th, td {
                            padding: 10px 5px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🗺️ Карта сайта</h1>
                        <p>Asia Taren - Оборудование для птицеводства</p>
                        <div class="stats">
                            <div class="stat">
                                <span class="stat-number">
                                    <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
                                </span>
                                <span class="stat-label">Всего страниц</span>
                            </div>
                        </div>
                    </div>

                    <div class="content">
                        <div class="info-box">
                            <h3>ℹ️ О карте сайта</h3>
                            <p>Это XML карта сайта, которая помогает поисковым системам эффективно индексировать страницы нашего сайта. Все URL-адреса отсортированы по приоритету.</p>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 50%;">URL</th>
                                    <th style="width: 15%;">Приоритет</th>
                                    <th style="width: 20%;">Частота обновлений</th>
                                    <th style="width: 15%;">Изменено</th>
                                </tr>
                            </thead>
                            <tbody>
                                <xsl:for-each select="sitemap:urlset/sitemap:url">
                                    <xsl:sort select="sitemap:priority" order="descending"/>
                                    <tr>
                                        <td>
                                            <a class="url-link" href="{sitemap:loc}">
                                                <xsl:value-of select="sitemap:loc"/>
                                            </a>
                                        </td>
                                        <td>
                                            <xsl:variable name="priority" select="sitemap:priority"/>
                                            <span>
                                                <xsl:attribute name="class">
                                                    <xsl:text>priority </xsl:text>
                                                    <xsl:choose>
                                                        <xsl:when test="$priority &gt; 0.8">priority-high</xsl:when>
                                                        <xsl:when test="$priority &gt; 0.5">priority-medium</xsl:when>
                                                        <xsl:otherwise>priority-low</xsl:otherwise>
                                                    </xsl:choose>
                                                </xsl:attribute>
                                                <xsl:value-of select="sitemap:priority"/>
                                            </span>
                                        </td>
                                        <td class="change-freq">
                                            <xsl:value-of select="sitemap:changefreq"/>
                                        </td>
                                        <td class="date">
                                            <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                                        </td>
                                    </tr>
                                </xsl:for-each>
                            </tbody>
                        </table>
                    </div>

                    <div class="footer">
                        <p>Сгенерировано автоматически • Asia Taren © 2026</p>
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>