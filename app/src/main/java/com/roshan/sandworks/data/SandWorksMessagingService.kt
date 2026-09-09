package com.roshan.sandworks.data

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.roshan.sandworks.MainActivity
import com.roshan.sandworks.R
import com.roshan.sandworks.SandWorksApp

class SandWorksMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        try {
            // Register token with current user document if authenticated
            val uid = FirebaseAuth.getInstance().currentUser?.uid
            if (!uid.isNullOrBlank()) {
                FirebaseFirestore.getInstance().collection("users").document(uid)
                    .update("fcmToken", token)
            }
        } catch (_: Exception) {
            // Gracefully ignore registration failure in offline/emulator environment
        }
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        try {
            val title = remoteMessage.data["title"] ?: remoteMessage.notification?.title ?: "SAND WORKS Alert"
            val body = remoteMessage.data["message"] ?: remoteMessage.notification?.body ?: "New operational update"
            val type = remoteMessage.data["type"] ?: "BROADCAST"

            val channelId = when (type) {
                "EMERGENCY" -> SandWorksApp.CHANNEL_EMERGENCY
                "ACCRUAL" -> SandWorksApp.CHANNEL_ACCRUALS
                else -> SandWorksApp.CHANNEL_BROADCAST
            }

            val intent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }

            val pendingIntent = PendingIntent.getActivity(
                this,
                0,
                intent,
                PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
            )

            val notification = NotificationCompat.Builder(this, channelId)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(body)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)
                .setPriority(
                    if (type == "EMERGENCY") NotificationCompat.PRIORITY_MAX
                    else NotificationCompat.PRIORITY_DEFAULT
                )
                .build()

            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify((System.currentTimeMillis() % 10000).toInt(), notification)
        } catch (_: Exception) {
            // Gracefully ignore notification build failure
        }
    }
}
