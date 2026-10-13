package com.golazostore.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val context = LocalContext.current
            val webView = remember {
                WebView(context).apply {
                    settings.javaScriptEnabled = true
                    settings.domStorageEnabled = true
                    settings.allowFileAccess = true
                    settings.allowUniversalAccessFromFileURLs = true
                    webViewClient = object : WebViewClient() {
                        override fun shouldOverrideUrlLoading(
                            view: WebView,
                            request: WebResourceRequest
                        ): Boolean {
                            val url = request.url.toString()
                            // http/file se quedan en el WebView; WhatsApp, teléfono, etc. abren fuera
                            return if (url.startsWith("http") || url.startsWith("file")) {
                                false
                            } else {
                                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                                true
                            }
                        }
                    }
                    loadUrl("file:///android_asset/www/index.html")
                }
            }
            DisposableEffect(Unit) {
                onDispose { webView.destroy() }
            }
            AndroidView(
                factory = { webView },
                modifier = Modifier.fillMaxSize()
            )
            BackHandler {
                if (webView.canGoBack()) webView.goBack() else finish()
            }
        }
    }
}
