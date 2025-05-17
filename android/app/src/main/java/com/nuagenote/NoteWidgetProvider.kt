package com.nuagenote

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class NoteWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {

            val appName = context.applicationInfo.loadLabel(context.packageManager).toString()

            // Intent pour ouvrir l'application principale
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // RemoteViews lié au layout widget
            val views = RemoteViews(context.packageName, R.layout.widget_note)

            // Afficher le nom de l'app
            views.setTextViewText(R.id.appNameTextView, appName)

            // Associer le click sur noteTextView et appNameTextView pour ouvrir l'app
            views.setOnClickPendingIntent(R.id.noteTextView, pendingIntent)
            views.setOnClickPendingIntent(R.id.appNameTextView, pendingIntent)

            // Mettre à jour le widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
